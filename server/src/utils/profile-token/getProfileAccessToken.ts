////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function getProfileAccessToken(request: Request, name: string): string | undefined {
  try {
    const token: any = request.cookies[name]
    if (typeof token === "string" || typeof token === "undefined") { return token }
    throw new Error("Type of Profile Access Token is Invalid")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Profile Access Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
