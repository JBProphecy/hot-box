////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import cookieOptions from "@/config/cookieOptions"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ACCOUNT_ACCESS_TOKEN_COOKIE_OPTIONS = cookieOptions.ACCOUNT_ACCESS_TOKEN_COOKIE_OPTIONS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setAccountAccessTokenCookie(response: Response, name: string, value: string) {
  try {
    logger.attempt("Setting Account Access Token Cookie")
    response.cookie(name, value, ACCOUNT_ACCESS_TOKEN_COOKIE_OPTIONS)
    logger.success("Successfully Set Account Access Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Setting Account Access Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
