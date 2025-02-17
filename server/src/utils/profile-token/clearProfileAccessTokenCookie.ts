////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function clearProfileAccessTokenCookie(response: Response, name: string) {
  try {
    logger.attempt("Clearing Profile Access Token Cookie")
    response.clearCookie(name)
    logger.success("Successfully Cleared Profile Access Token Cookie")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Clearing Profile Access Token Cookie")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
