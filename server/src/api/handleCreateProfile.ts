////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"
import { CreateProfileBody, CreateProfileResult } from "shared/temp/CreateProfileResult"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Simpler
import setAccountTokenCookies from "@/utils/account-token/setAccountTokenCookies"

import prisma from "@/config/db"
import logger from "@/library/logger"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"

import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import hashPassword from "@/utils/hashPassword"
import refreshAccountTokens from "@/utils/account-token/refreshAccountTokens"
import verifyAccountToken from "@/utils/account-token/verifyAccountToken"
import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateProfile(request: Request, response: Response) {
  const attemptMessage: string = "Creating Profile"
  const successMessage: string = "Successfully Created Profile"
  const failureMessage: string = "Failed to Create Profile"
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    logger.attempt("Validating Body")
    const body: CreateProfileBody = request.body
    if (!body.accountID) {
      const message: string = "Account ID is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: CreateProfileResult = { message }
      return response.status(400).json(result)
    }
    if (!body.name || body.name.trim() === "") {
      const message: string = "Name is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: CreateProfileResult = { message }
      return response.status(400).json(result)
    }
    if (!body.username) {
      const message: string = "Username is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: CreateProfileResult = { message }
      return response.status(400).json(result)
    }
    if (!body.password) {
      const message: string = "Password is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: CreateProfileResult = { message }
      return response.status(400).json(result)
    }
    logger.success("Successfully Validated Body")

    // Process Account Tokens
    logger.attempt("Processing Account Tokens")
    const { accountAccessTokenKey, accountRefreshTokenKey }: AccountTokenKeys = generateAccountTokenKeys(body.accountID)
    const accountAccessToken: string | undefined = request.cookies[accountAccessTokenKey]
    if (typeof accountAccessToken === "undefined") { throw new Error("Missing Account Access Token") }
    const accountAccessTokenPayload: AccountTokenPayload | "expired" | "invalid" = verifyAccountToken(accountAccessToken)
    if (accountAccessTokenPayload === "invalid") {
      logger.failure("Device Token is Invalid")
      // needs work
    }
    if (accountAccessTokenPayload === "expired") {
      logger.warning("Account Access Token is Expired")
      const accountRefreshToken: string | undefined = request.cookies[accountRefreshTokenKey]
      if (typeof accountRefreshToken === "undefined") { throw new Error("Missing Account Refresh Token") }
      const { refreshed, accountTokens } = refreshAccountTokens(accountRefreshToken)
      if (!refreshed) {
        const message: string = "Your Account Session has Expired... Please Sign In Again"
        logger.warning(message)
        logger.failure(failureMessage)
        const result: CreateProfileResult = { message }
        return response.status(403).json(result)
      }
      if (typeof accountTokens === "undefined") { throw new Error("Missing Account Tokens") }
      setAccountTokenCookies({
        response,
        accountAccessTokenKey,
        accountRefreshTokenKey,
        accountAccessToken: accountTokens.accountAccessToken,
        accountRefreshToken: accountTokens.accountRefreshToken
      })
    }
    logger.success("Successfully Processed Account Tokens")

    // Check Username Availability / Existing Profile
    logger.attempt("Checking Username Availability")
    const profile = await prisma.profile.findUnique({
      where: { username: body.username }
    })
    if (profile !== null) {
      const message: string = "Username is Already Registered"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: CreateProfileResult = { message }
      return response.status(400).json(result)
    }
    logger.success("Username is Available")

    // Hash Password
    const hashedPassword: string = await hashPassword(body.password)

    // Register Profile
    logger.attempt("Attempting to Register Profile in the Database")
    await prisma.profile.create({
      data: {
        name: body.name,
        username: body.username,
        password: hashedPassword,
        accountID: body.accountID
      }
    })
    logger.success("Successfully Registered Profile in the Database")

    logger.success(successMessage)
    const result: CreateProfileResult = { message: successMessage }
    return response.status(201).json(result)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(failureMessage)
    logger.error(error)
    logger.trace(error)
    const result: CreateProfileResult = { message: "Server Error" }
    return response.status(500).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
