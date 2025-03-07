////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"

import { Request } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_KEY: string = serverConfig.tokens.DEVICE_TOKEN_KEY

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function getDeviceToken(request: Request): string | undefined {
  try {
    logger.attempt("Getting Device Token")
    const deviceToken: any = request.cookies[DEVICE_TOKEN_KEY]
    if (typeof deviceToken === "string" || typeof deviceToken === "undefined") { return deviceToken }
    throw new Error("Type of Device Token is Invalid")
  }
  catch(object: unknown) {
    const error = object as Error
    logger.failure("Error Fetching Device Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
