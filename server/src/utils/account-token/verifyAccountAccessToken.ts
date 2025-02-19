////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"

import verifyToken from "@/utils/verifyToken"
import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"

import { JwtPayload } from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ACCOUNT_TOKEN_SECRET: string = serverConfig.secrets.ACCOUNT_TOKEN_SECRET

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function verifyAccountAccessToken(token: string): AccountTokenPayload | "expired" | "invalid" {
  try {
    logger.attempt("Verifying Account Access Token")
    const payload: JwtPayload | "expired" | "invalid" = verifyToken(token, ACCOUNT_TOKEN_SECRET)
    if (payload !== "expired" && payload !== "invalid") { return payload as AccountTokenPayload }
    return payload
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Verifying Account Access Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
