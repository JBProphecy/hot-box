////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import cookieOptions from "@/config/cookieOptions"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PROFILE_ACCESS_TOKEN_COOKIE_OPTIONS = cookieOptions.PROFILE_ACCESS_TOKEN_COOKIE_OPTIONS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setProfileAccessTokenCookie(response: Response, name: string, value: string) {
  try {
    logger.attempt("Setting Profile Access Token Cookie")
    response.cookie(name, value, PROFILE_ACCESS_TOKEN_COOKIE_OPTIONS)
    logger.success("Successfully Set Profile Access Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Setting Profile Access Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
