////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"
import AccountTokenPayload from "@/types/AccountTokenPayload"
import AccountTokens from "@/types/AccountTokens"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const JWT_SECRET: string = serverConfig.secrets.JWT_SECRET
const ACCOUNT_ACCESS_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION: number = serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateAccountAccessToken(payload: AccountTokenPayload): string {
  const options = { expiresIn: ACCOUNT_ACCESS_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

function generateAccountRefreshToken(payload: AccountTokenPayload): string {
  const options = { expiresIn: ACCOUNT_REFRESH_TOKEN_DURATION }
  return jwt.sign(payload, JWT_SECRET, options)
}

export default function generateAccountTokens(payload: AccountTokenPayload): AccountTokens {
  const accountAccessToken: string = generateAccountAccessToken(payload)
  const accountRefreshToken: string = generateAccountRefreshToken(payload)
  return { accountAccessToken, accountRefreshToken } as AccountTokens
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
