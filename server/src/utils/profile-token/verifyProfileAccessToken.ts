////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"

import verifyToken from "@/utils/verifyToken"
import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"

import { JwtPayload } from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PROFILE_TOKEN_SECRET: string = serverConfig.secrets.PROFILE_TOKEN_SECRET

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function verifyProfileAccessToken(token: string): ProfileTokenPayload | "expired" | "invalid" {
  try {
    const payload: JwtPayload | "expired" | "invalid" = verifyToken(token, PROFILE_TOKEN_SECRET)
    if (payload !== "expired" && payload !== "invalid") { return payload as ProfileTokenPayload }
    return payload
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Verifying Profile Access Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
