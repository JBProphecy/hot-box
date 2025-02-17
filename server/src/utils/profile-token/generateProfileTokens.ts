////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"
import logger from "@/library/logger"
import serverConfig from "@/config/env"
import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"
import ProfileTokens from "@/types/profile-token/ProfileTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PROFILE_TOKEN_SECRET: string = serverConfig.secrets.PROFILE_TOKEN_SECRET
const PROFILE_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_ACCESS_TOKEN_DURATION
const PROFILE_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateProfileAccessToken(payload: ProfileTokenPayload): string {
  try {
    logger.attempt("Generating Profile Access Token")
    const options = { expiresIn: PROFILE_ACCESS_TOKEN_DURATION }
    const token: string = jwt.sign(payload, PROFILE_TOKEN_SECRET, options)
    logger.success("Successfully Generated Profile Access Token")
    return token
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Profile Access Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function generateProfileRefreshToken(payload: ProfileTokenPayload): string {
  try {
    logger.attempt("Generating Profile Refresh Token")
    const options = { expiresIn: PROFILE_REFRESH_TOKEN_DURATION }
    const token: string = jwt.sign(payload, PROFILE_TOKEN_SECRET, options)
    logger.success("Successfully Generated Profile Refresh Token")
    return token
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Profile Refresh Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

export default function generateProfileTokens(payload: ProfileTokenPayload): ProfileTokens {
  try {
    logger.attempt("Generating Profile Tokens")
    const profileAccessToken: string = generateProfileAccessToken(payload)
    const profileRefreshToken: string = generateProfileRefreshToken(payload)
    logger.success("Successfully Generated Profile Tokens")
    return { profileAccessToken, profileRefreshToken } as ProfileTokens
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Profile Tokens")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
