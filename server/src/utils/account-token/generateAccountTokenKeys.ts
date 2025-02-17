////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"
import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function generateAccountTokenKeys(id: string): AccountTokenKeys {
  try {
    logger.attempt("Generating Account Token Keys")
    const accountAccessTokenKey: string = `${serverConfig.app.NAME}_account${id}_accessToken`
    const accountRefreshTokenKey: string = `${serverConfig.app.NAME}_account${id}_refreshToken`
    logger.success("Successfully Generated Account Token Keys")
    return { accountAccessTokenKey, accountRefreshTokenKey } as AccountTokenKeys
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Account Token Keys")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
