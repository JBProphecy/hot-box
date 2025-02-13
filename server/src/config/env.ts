////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import dotenv from "dotenv"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { globalConfig, GlobalConfig } from "shared/config/env"
import logger from "@/config/logger"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

dotenv.config()
const envFile: string | undefined = process.env.NODE_ENV
if (envFile?.trim() === "production") { dotenv.config({ path: ".env.production" }) }
if (envFile?.trim() === "development") { dotenv.config({ path: ".env.development" }) }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processString(key: string): string {
  const value: string | undefined = process.env[key]
  if (typeof value === "undefined") { throw new Error(`${key} is Required and Undefined`) }
  return value
}

function processNumber(key: string): number {
  const value: string | undefined = process.env[key]
  if (typeof value === "undefined") { throw new Error(`${key} is Required and Undefined`) }
  const number = parseInt(value)
  if (isNaN(number)) { throw new Error(`${key} is Not a Number`) }
  return number
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ServerEnvironment = {
  CLIENT_ORIGIN: string,
  CRYPTO_KEY: string,
  JWT_SECRET: string,
  ACCOUNT_ACCESS_TOKEN_DURATION: number,
  ACCOUNT_REFRESH_TOKEN_DURATION: number,
  PROFILE_ACCESS_TOKEN_DURATION: number,
  PROFILE_REFRESH_TOKEN_DURATION: number,
}

function processServerEnvironment(): ServerEnvironment {
  try {
    const serverEnvironment: ServerEnvironment = {
      CLIENT_ORIGIN: processString("CLIENT_ORIGIN"),
      CRYPTO_KEY: processString("CRYPTO_KEY"),
      JWT_SECRET: processString("JWT_SECRET"),
      ACCOUNT_ACCESS_TOKEN_DURATION: processNumber("ACCOUNT_ACCESS_TOKEN_DURATION"),
      ACCOUNT_REFRESH_TOKEN_DURATION: processNumber("ACCOUNT_REFRESH_TOKEN_DURATION"),
      PROFILE_ACCESS_TOKEN_DURATION: processNumber("PROFILE_ACCESS_TOKEN_DURATION"),
      PROFILE_REFRESH_TOKEN_DURATION: processNumber("PROFILE_REFRESH_TOKEN_DURATION"),
    }
    return serverEnvironment
  }
  catch (object: unknown) {
    const error = object as Error
    logger.error("Error Processing Server Environment")
    logger.trace(error)
    logger.line()
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ServerConfig = {
  app: {
    NAME: string
  },
  client: {
    ORIGIN: string
  },
  secrets: {
    CRYPTO_KEY: string,
    JWT_SECRET: string
  }
  token: {
    duration: {
      ACCOUNT_ACCESS_TOKEN_DURATION: number,
      ACCOUNT_REFRESH_TOKEN_DURATION: number,
      PROFILE_ACCESS_TOKEN_DURATION: number,
      PROFILE_REFRESH_TOKEN_DURATION: number
    },
    keys: {
      CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: string,
      CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: string
      CURRENT_PROFILE_ACCESS_TOKEN_KEY: string,
      CURRENT_PROFILE_REFRESH_TOKEN_KEY: string
    }
  }
}

function generateServerConfig(globalConfig: GlobalConfig): ServerConfig {
  try {
    const serverEnvironment: ServerEnvironment = processServerEnvironment()
    const serverConfig: ServerConfig = {
      app: {
        NAME: globalConfig.APP_NAME
      },
      client: {
        ORIGIN: serverEnvironment.CLIENT_ORIGIN
      },
      secrets: {
        CRYPTO_KEY: serverEnvironment.CRYPTO_KEY,
        JWT_SECRET: serverEnvironment.JWT_SECRET
      },
      token: {
        duration: {
          ACCOUNT_ACCESS_TOKEN_DURATION: serverEnvironment.ACCOUNT_ACCESS_TOKEN_DURATION,
          ACCOUNT_REFRESH_TOKEN_DURATION: serverEnvironment.ACCOUNT_REFRESH_TOKEN_DURATION,
          PROFILE_ACCESS_TOKEN_DURATION: serverEnvironment.PROFILE_ACCESS_TOKEN_DURATION,
          PROFILE_REFRESH_TOKEN_DURATION: serverEnvironment.PROFILE_REFRESH_TOKEN_DURATION
        },
        keys: {
          CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: globalConfig.CURRENT_ACCOUNT_ACCESS_TOKEN_KEY,
          CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: globalConfig.CURRENT_ACCOUNT_REFRESH_TOKEN_KEY,
          CURRENT_PROFILE_ACCESS_TOKEN_KEY: globalConfig.CURRENT_PROFILE_ACCESS_TOKEN_KEY,
          CURRENT_PROFILE_REFRESH_TOKEN_KEY: globalConfig.CURRENT_PROFILE_REFRESH_TOKEN_KEY
        }
      }
    }
    return serverConfig
  }
  catch (object: unknown) {
    const error = object as Error
    logger.error("Error Generating Server Config")
    logger.trace(error)
    logger.line()
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let serverConfig: ServerConfig
try { serverConfig = generateServerConfig(globalConfig) }
catch (object: unknown) { process.exit(0) }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default serverConfig

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
