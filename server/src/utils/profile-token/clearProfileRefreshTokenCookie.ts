////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function clearProfileRefreshTokenCookie(response: Response, name: string) {
  try {
    logger.attempt("Clearing Profile Refresh Token Cookie")
    response.clearCookie(name)
    logger.success("Successfully Cleared Profile Refresh Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Clearing Profile Refresh Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
