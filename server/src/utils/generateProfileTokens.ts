////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"
import ProfileTokenPayload from "@/types/ProfileTokenPayload"
import ProfileTokens from "@/types/ProfileTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.secrets.JWT_SECRET
const PROFILE_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_ACCESS_TOKEN_DURATION
const PROFILE_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateProfileAccessToken(payload: ProfileTokenPayload): string {
  const options = { expiresIn: PROFILE_ACCESS_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

function generateProfileRefreshToken(payload: ProfileTokenPayload): string {
  const options = { expiresIn: PROFILE_REFRESH_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

export default function generateProfileTokens(payload: ProfileTokenPayload): ProfileTokens {
  const profileAccessToken: string = generateProfileAccessToken(payload)
  const profileRefreshToken: string = generateProfileRefreshToken(payload)
  return { profileAccessToken, profileRefreshToken } as ProfileTokens
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
