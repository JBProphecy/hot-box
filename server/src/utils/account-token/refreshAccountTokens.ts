////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NEEDS WORK

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import verifyAccountToken from "@/utils/account-token/verifyAccountToken"
import AccountTokens from "@/types/account-token/AccountTokens"
import generateAccountTokens from "@/utils/account-token/generateAccountTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type RefreshAccountTokensParams = {
  accountRefreshToken: string
}

export type RefreshAccountTokensResult = {
  refreshed: boolean,
  accountTokens?: AccountTokens
}

export default function refreshAccountTokens(accountRefreshToken: string) {
  const attemptMessage = "Attempting to Refresh Account Tokens"
  const successMessage = "Successfully Refreshed Account Tokens"
  const failureMessage = "Failed to Refresh Account Tokens"
  try {
    logger.attempt(attemptMessage)

    // Verify Account Refresh Token
    const accountRefreshTokenPayload = verifyAccountToken(accountRefreshToken)
    if (accountRefreshTokenPayload === "expired") {
      const message = "Account Refresh Token is Expired"
      logger.warning(message)
      logger.failure(failureMessage)
      return { refreshed: false } as RefreshAccountTokensResult
    }
    if (accountRefreshTokenPayload === "invalid") {
      const message: string = "Account Refresh Token is Invalid"
      logger.warning(message)
      logger.failure(failureMessage)
      return { refreshed: false } as RefreshAccountTokensResult
    }

    // Generate Account Tokens
    const accountTokens: AccountTokens = generateAccountTokens(accountRefreshTokenPayload)

    // Successful Result
    logger.success(successMessage)
    return { refreshed: true, accountTokens } as RefreshAccountTokensResult
  }
  catch(object: unknown) {
    const error = object as Error
    logger.failure(failureMessage)
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
