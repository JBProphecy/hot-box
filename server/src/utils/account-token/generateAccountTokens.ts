////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"
import logger from "@/library/logger"
import serverConfig from "@/config/env"
import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import AccountTokens from "@/types/account-token/AccountTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ACCOUNT_TOKEN_SECRET: string = serverConfig.secrets.ACCOUNT_TOKEN_SECRET
const ACCOUNT_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateAccountAccessToken(payload: AccountTokenPayload): string {
  try {
    logger.attempt("Generating Account Access Token")
    const options = { expiresIn: ACCOUNT_ACCESS_TOKEN_DURATION }
    const token: string = jwt.sign(payload, ACCOUNT_TOKEN_SECRET, options)
    logger.success("Successfully Generated Account Access Token")
    return token
  }
  catch(object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Account Access Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function generateAccountRefreshToken(payload: AccountTokenPayload): string {
  try {
    logger.attempt("Generating Account Refresh Token")
    const options = { expiresIn: ACCOUNT_REFRESH_TOKEN_DURATION }
    const token: string = jwt.sign(payload, ACCOUNT_TOKEN_SECRET, options)
    logger.success("Successfully Generated Account Refresh Token")
    return token
  }
  catch(object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Account Refresh Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

export default function generateAccountTokens(payload: AccountTokenPayload): AccountTokens {
  try {
    logger.attempt("Generating Account Tokens")
    const accountAccessToken: string = generateAccountAccessToken(payload)
    const accountRefreshToken: string = generateAccountRefreshToken(payload)
    logger.success("Successfully Generated Account Tokens")
    return { accountAccessToken, accountRefreshToken } as AccountTokens
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Account Tokens")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
