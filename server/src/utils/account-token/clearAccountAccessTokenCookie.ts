////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function clearAccountAccessTokenCookie(response: Response, name: string) {
  try {
    logger.attempt("Clearing Account Access Token Cookie")
    response.clearCookie(name)
    logger.success("Successfully Cleared Account Access Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Clearing Account Access Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
