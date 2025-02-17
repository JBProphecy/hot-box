////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"
import cookieOptions from "@/config/cookieOptions"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_KEY: string = serverConfig.tokens.DEVICE_TOKEN_KEY
const DEVICE_TOKEN_COOKIE_OPTIONS = cookieOptions.DEVICE_TOKEN_COOKIE_OPTIONS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setDeviceTokenCookie(response: Response, value: string) {
  try {
    logger.attempt("Setting Device Token Cookie")
    response.cookie(DEVICE_TOKEN_KEY, value, DEVICE_TOKEN_COOKIE_OPTIONS)
    logger.success("Successfully Set Device Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Setting Device Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
