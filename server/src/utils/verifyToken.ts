////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import jwt, { JwtPayload } from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * verifies a JWT
 * @param token - the token
 * @param secret - the secret key
 * @returns the token's payload | "expired" | "invalid"
 */
export default function verifyToken(token: string, secret: string): JwtPayload | "expired" | "invalid" {
  try {
    const payload: JwtPayload | string = jwt.verify(token, secret)
    if (typeof payload === "string") { throw new Error("payload is a string (idk)") }
    return payload
  }
  catch (object: unknown) {
    const error = object as Error
    if (error.name === "TokenExpiredError") { return "expired" }
    if (error.name === "JsonWebTokenError") { return "invalid" }
    logger.failure("Error Verifying Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
