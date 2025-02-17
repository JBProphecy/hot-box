////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import cookieOptions from "@/config/cookieOptions"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ACCOUNT_REFRESH_TOKEN_COOKIE_OPTIONS = cookieOptions.ACCOUNT_REFRESH_TOKEN_COOKIE_OPTIONS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setAccountRefreshTokenCookie(response: Response, name: string, value: string) {
  try {
    logger.attempt("Setting Account Refresh Token Cookie")
    response.cookie(name, value, ACCOUNT_REFRESH_TOKEN_COOKIE_OPTIONS)
    logger.success("Successfully Set Account Refresh Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Setting Account Refresh Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
