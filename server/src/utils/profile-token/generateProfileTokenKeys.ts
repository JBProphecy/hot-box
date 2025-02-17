////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"
import ProfileTokenKeys from "@/types/profile-token/ProfileTokenKeys"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function generateProfileTokenKeys(id: string): ProfileTokenKeys {
  try {
    logger.attempt("Generating Profile Token Keys")
    const profileAccessTokenKey: string = `${serverConfig.app.NAME}_profile${id}_accessToken`
    const profileRefreshTokenKey: string = `${serverConfig.app.NAME}_profile${id}_refreshToken`
    logger.success("Successfully Generated Profile Token Keys")
    return { profileAccessTokenKey, profileRefreshTokenKey } as ProfileTokenKeys
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Profile Token Keys")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
