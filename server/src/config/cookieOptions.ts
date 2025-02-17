////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"

import { CookieOptions } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateCookieOptions(duration: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: duration * 1000,
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CookieOptionsConfig = {
    DEVICE_TOKEN_COOKIE_OPTIONS: CookieOptions
    ACCOUNT_ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions
    ACCOUNT_REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions
    PROFILE_ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions
    PROFILE_REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions
}

function generateCookieOptionsConfig(): CookieOptionsConfig {
  try {
    const DEVICE_TOKEN_DURATION: number = 1000 * 60 * 60 * 24 * 365 * 5 // 5 Years (mutable)
    const cookies: CookieOptionsConfig = {
      DEVICE_TOKEN_COOKIE_OPTIONS: generateCookieOptions(DEVICE_TOKEN_DURATION),
      ACCOUNT_ACCESS_TOKEN_COOKIE_OPTIONS: generateCookieOptions(serverConfig.tokens.ACCOUNT_ACCESS_TOKEN_DURATION),
      ACCOUNT_REFRESH_TOKEN_COOKIE_OPTIONS: generateCookieOptions(serverConfig.tokens.ACCOUNT_REFRESH_TOKEN_DURATION),
      PROFILE_ACCESS_TOKEN_COOKIE_OPTIONS: generateCookieOptions(serverConfig.tokens.PROFILE_ACCESS_TOKEN_DURATION),
      PROFILE_REFRESH_TOKEN_COOKIE_OPTIONS: generateCookieOptions(serverConfig.tokens.PROFILE_REFRESH_TOKEN_DURATION)
    }
    return cookies
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Cookie Options Config")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let cookieOptions: CookieOptionsConfig
try { cookieOptions = generateCookieOptionsConfig() }
catch (object: unknown) { process.exit(0) }
export default cookieOptions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
