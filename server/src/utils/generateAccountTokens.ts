////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.secrets.JWT_SECRET
const ACCOUNT_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AccountTokenPayload = { deviceID: string, accountID: string, version: number }

function generateAccountAccessToken(payload: AccountTokenPayload): string {
  const options = { expiresIn: ACCOUNT_ACCESS_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

function generateAccountRefreshToken(payload: AccountTokenPayload): string {
  const options = { expiresIn: ACCOUNT_REFRESH_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

export type GeneratedAccountTokens = { accountAccessToken: string, accountRefreshToken: string }

export function generateAccountTokens(payload: AccountTokenPayload): GeneratedAccountTokens {
  const accountAccessToken: string = generateAccountAccessToken(payload)
  const accountRefreshToken: string = generateAccountRefreshToken(payload)
  return { accountAccessToken, accountRefreshToken } as GeneratedAccountTokens
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
