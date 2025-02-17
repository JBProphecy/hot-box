////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NEEDS WORK OR REMOVAL

import { Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ACCOUNT_ACCESS_TOKEN_DURATION = serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION
const ACCOUNT_REFRESH_TOKEN_DURATION = serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setAccountAccessTokenCookie({
  response,
  accountAccessTokenKey,
  accountAccessToken
}: {
  response: Response
  accountAccessTokenKey: string,
  accountAccessToken: string
}) {
  response.cookie(accountAccessTokenKey, accountAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCOUNT_ACCESS_TOKEN_DURATION * 1000
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setAccountRefreshTokenCookie({
  response,
  accountRefreshTokenKey,
  accountRefreshToken
}: {
  response: Response
  accountRefreshTokenKey: string,
  accountRefreshToken: string
}) {
  response.cookie(accountRefreshTokenKey, accountRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCOUNT_REFRESH_TOKEN_DURATION * 1000
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function setAccountTokenCookies({
  response,
  accountAccessTokenKey,
  accountRefreshTokenKey,
  accountAccessToken,
  accountRefreshToken
}: {
  response: Response,
  accountAccessTokenKey: string,
  accountRefreshTokenKey: string,
  accountAccessToken: string,
  accountRefreshToken: string
}) {
  setAccountAccessTokenCookie({ response, accountAccessTokenKey, accountAccessToken })
  setAccountRefreshTokenCookie({ response, accountRefreshTokenKey, accountRefreshToken })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
