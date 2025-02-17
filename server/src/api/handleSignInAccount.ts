////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"
import { SignInAccountBody, SignInAccountResult } from "shared/temp/SignInAccountResult"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Simpler
import setAccountAccessTokenCookie from "@/utils/account-token/setAccountAccessTokenCookie"
import setAccountRefreshTokenCookie from "@/utils/account-token/setAccountRefreshTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import prisma from "@/config/db"
import logger from "@/library/logger"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import AccountTokens from "@/types/account-token/AccountTokens"

import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import generateAccountTokens from "@/utils/account-token/generateAccountTokens"

import verifyPassword from "@/utils/verifyPassword"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleSignInAccount(request: Request, response: Response) {
  const attemptMessage: string = "Signing In to Your Account"
  const successMessage: string = "Successfully Signed In to Your Account"
  const failureMessage: string = "Failed to Sign In to Your Account"
  const invalidCredentialsMessage: string = "Email and Password are Not Associated"
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    logger.attempt("Validating Body")
    const body: SignInAccountBody = request.body
    if (!body.email) {
      const message: string = "Email is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: SignInAccountResult = { message }
      return response.status(400).json(result)
    }
    if (!body.password) {
      const message: string = "Password is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      const result: SignInAccountResult = { message }
      return response.status(400).json(result)
    }
    logger.success("Successfully Validated Body")

    // Fetch Account
    logger.attempt("Fetching Account")
    const account = await prisma.account.findUnique({
      where: { email: body.email }
    })
    if (account === null) {
      logger.warning("Email is Not Registered")
      logger.failure(failureMessage)
      const result: SignInAccountResult = { message: invalidCredentialsMessage }
      return response.status(400).json(result)
    }
    logger.success("Successfully Fetched Account")
    const accountID: string = account.id

    // Verify Password
    logger.attempt("Verifying Password")
    const doPasswordsMatch: boolean = await verifyPassword(account.password, body.password)
    if (!doPasswordsMatch) {
      logger.warning("Passwords do Not Match")
      logger.failure(failureMessage)
      const result: SignInAccountResult = { message: invalidCredentialsMessage }
      return response.status(400).json(result)
    }
    logger.success("Successfully Verified Password")

    // Generate Account Tokens
    logger.attempt("Processing Account Tokens")
    const accountTokenPayload: AccountTokenPayload = { accountID }
    const { accountAccessToken, accountRefreshToken }: AccountTokens = generateAccountTokens(accountTokenPayload)
    const { accountAccessTokenKey, accountRefreshTokenKey}: AccountTokenKeys = generateAccountTokenKeys(accountID)
    setAccountAccessTokenCookie(response, accountAccessTokenKey, accountAccessToken)
    setAccountRefreshTokenCookie(response, accountRefreshTokenKey, accountRefreshToken)
    logger.success("Successfully Processed Account Tokens")

    logger.success(successMessage)
    const result: SignInAccountResult = { message: successMessage, accountID }
    logger.message(accountID)
    return response.status(200).json(result)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(failureMessage)
    logger.error(error)
    logger.trace(error)
    const result: SignInAccountResult = { message: "Server Error" }
    return response.status(500).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
