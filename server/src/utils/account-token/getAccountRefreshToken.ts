////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function getAccountRefreshToken(request: Request, name: string): string | undefined {
  try {
    const token: any = request.cookies[name]
    if (typeof token === "string" || typeof token === "undefined") { return token }
    throw new Error("Type of Account Refresh Token is Invalid")
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Account Refresh Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
