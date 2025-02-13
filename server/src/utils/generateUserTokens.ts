////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.security.JWT_SECRET
const ACCOUNT_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.account.ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.account.REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type AccessTokenPayload = { userID: string }

function generateAccessToken(userID: string): string {
  const payload: AccessTokenPayload = { userID }
  const options = { expiresIn: ACCOUNT_ACCESS_TOKEN_DURATION }
  return jwt.sign( payload, JWT_SECRET, options)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type RefreshTokenPayload = { userID: string }

function generateRefreshToken(userID: string): string {
  const payload: RefreshTokenPayload = { userID }
  const options = { expiresIn: ACCOUNT_REFRESH_TOKEN_DURATION }
  return jwt.sign( payload, JWT_SECRET, options)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type GeneratedTokens = { accessToken: string, refreshToken: string }

export default function generateUserTokens(userID: string): GeneratedTokens {
  const accessToken: string = generateAccessToken(userID)
  const refreshToken: string = generateRefreshToken(userID)
  return { accessToken, refreshToken } as GeneratedTokens
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
