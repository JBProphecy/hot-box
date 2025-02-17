////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import cookieOptions from "@/config/cookieOptions"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PROFILE_REFRESH_TOKEN_COOKIE_OPTIONS = cookieOptions.PROFILE_REFRESH_TOKEN_COOKIE_OPTIONS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setProfileRefreshTokenCookie(response: Response, name: string, value: string) {
  try {
    logger.attempt("Setting Profile Refresh Token Cookie")
    response.cookie(name, value, PROFILE_REFRESH_TOKEN_COOKIE_OPTIONS)
    logger.success("Successfully Set Profile Refresh Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Setting Profile Refresh Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
