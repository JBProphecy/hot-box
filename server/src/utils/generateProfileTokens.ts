////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.secrets.JWT_SECRET
const PROFILE_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_ACCESS_TOKEN_DURATION
const PROFILE_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.PROFILE_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ProfileTokenPayload = { deviceID: string, profileID: string, version: number }

function generateProfileAccessToken(payload: ProfileTokenPayload): string {
  const options = { expiresIn: PROFILE_ACCESS_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

function generateProfileRefreshToken(payload: ProfileTokenPayload): string {
  const options = { expiresIn: PROFILE_REFRESH_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

export type GeneratedProfileTokens = { profileAccessToken: string, profileRefreshToken: string }

export function generateProfileTokens(payload: ProfileTokenPayload): GeneratedProfileTokens {
  const profileAccessToken: string = generateProfileAccessToken(payload)
  const profileRefreshToken: string = generateProfileRefreshToken(payload)
  return { profileAccessToken, profileRefreshToken } as GeneratedProfileTokens
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
