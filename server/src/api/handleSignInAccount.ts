////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import prisma from "@/config/db"
import logger from "@/config/logger"

import serverConfig from "@/config/env"

import SignInAccountBody from "shared/types/SignInAccountBody"
import verifyPassword from "@/utils/verifyPassword"

import AccountTokenKeys from "@/types/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/generateAccountTokenKeys"
import AccountTokenPayload from "@/types/AccountTokenPayload"
import AccountTokens from "@/types/AccountTokens"
import generateAccountTokens from "@/utils/generateAccountTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_KEY = serverConfig.tokens.DEVICE_TOKEN_KEY
const ACCOUNT_ACCESS_TOKEN_DURATION = serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION = serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleSignInAccount(request: Request, response: Response) {
  const attemptMessage: string = "Signing In to Your Account"
  const successMessage: string = "Successfully Signed In to Your Account"
  const failureMessage: string = "Failed to Sign In to Your Account"
  const invalidCredentialsMessage: string = "Email and Password are Not Associated"
  try {
    logger.attempt(attemptMessage)

    logger.attempt("Validating Body")
    const body: SignInAccountBody = request.body
    if (!body.email) {
      const message: string = "Email is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(400).json({ message })
    }
    if (!body.password) {
      const message: string = "Password is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(400).json({ message })
    }
    logger.success("Successfully Validated Body")

    /*
    logger.attempt("Verifying Device Token")
    const deviceToken: string | undefined = request.cookies[DEVICE_TOKEN_KEY]
    if (typeof deviceToken === "undefined") {
      const message: string = "Missing Device Token"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(403).json({ message })
    }
    const deviceTokenPayload: DeviceTokenPayload | "expired" = verifyDeviceToken(deviceToken)
    if (deviceTokenPayload === "expired") {
      const message: string = "Device Token is Expired"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(403).json({ message })
    }
    logger.success("Successfully Verified Device Token")
    const deviceID: string = deviceTokenPayload.deviceID
    */

    logger.attempt("Fetching Account")
    const account = await prisma.accounts.findUnique({
      where: { email: body.email }
    })
    if (account === null) {
      logger.warning("Email is Not Registered")
      logger.failure(failureMessage)
      return response.status(400).json({ message: invalidCredentialsMessage })
    }
    logger.success("Successfully Fetched Account")

    logger.attempt("Verifying Password")
    const doPasswordsMatch: boolean = await verifyPassword(account.password, body.password)
    if (!doPasswordsMatch) {
      logger.warning("Passwords do Not Match")
      logger.failure(failureMessage)
      return response.status(400).json({ message: invalidCredentialsMessage })
    }
    logger.success("Successfully Verified Password")

    logger.attempt("Processing Account Tokens")
    const accountTokenPayload: AccountTokenPayload = { accountID: account.id }
    const { accountAccessToken, accountRefreshToken }: AccountTokens = generateAccountTokens(accountTokenPayload)
    const { accountAccessTokenKey, accountRefreshTokenKey}: AccountTokenKeys = generateAccountTokenKeys(account.id)
    response.cookie(accountAccessTokenKey, accountAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCOUNT_ACCESS_TOKEN_DURATION * 1000
    })
    response.cookie(accountRefreshTokenKey, accountRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCOUNT_REFRESH_TOKEN_DURATION * 1000
    })
    logger.success("Successfully Processed Account Tokens")

    logger.success(successMessage)
    return response.status(200).json({
      message: successMessage,
      accountID: account.id
    })
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(failureMessage)
    logger.error(error)
    logger.trace(error)
    return response.status(500).json({ message: "Server Error" })
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
