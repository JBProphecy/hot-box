////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function clearAccountRefreshTokenCookie(response: Response, name: string) {
  try {
    logger.attempt("Clearing Account Refresh Token Cookie")
    response.clearCookie(name)
    logger.success("Successfully Cleared Account Refresh Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Clearing Account Refresh Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
