////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import dotenv from "dotenv"
import logger from "@/library/logger"

import { globalConfig, GlobalConfig } from "shared/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

dotenv.config()
const NODE_ENV: string | undefined = process.env.NODE_ENV
if (NODE_ENV?.trim() === "production") { dotenv.config({ path: ".env.production" }) }
if (NODE_ENV?.trim() === "development") { dotenv.config({ path: ".env.development" }) }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processString(key: string, required: true): string
function processString(key: string, required?: false): string | undefined
function processString(key: string, required?: boolean): string | undefined {
  const value: string | undefined = process.env[key]
  if (typeof value !== "undefined") { return value }
  if (!required) { return undefined }
  throw new Error(`${key} is Required and Undefined`)
}

function processNumber(key: string, required: true): number
function processNumber(key: string, required?: false): number | undefined
function processNumber(key: string, required?: boolean): number | undefined {
  const value: string | undefined = process.env[key]
  if (typeof value !== "undefined") {
    const number = parseInt(value, 10)
    if (!isNaN(number)) { return number }
    throw new Error(`${key} = "${value}" and "${value}" is Not a Number`)
  }
  if (!required) { return undefined }
  throw new Error(`${key} is Required and Undefined`)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ServerEnvironment = {
  CLIENT_ORIGIN: string
  DEVICE_TOKEN_SECRET: string
  ACCOUNT_TOKEN_SECRET: string
  PROFILE_TOKEN_SECRET: string
  ACCOUNT_ACCESS_TOKEN_DURATION: number
  ACCOUNT_REFRESH_TOKEN_DURATION: number
  PROFILE_ACCESS_TOKEN_DURATION: number
  PROFILE_REFRESH_TOKEN_DURATION: number
}

function processServerEnvironment(): ServerEnvironment {
  try {
    logger.attempt("Processing Server Environment")
    const serverEnvironment: ServerEnvironment = {
      CLIENT_ORIGIN: processString("CLIENT_ORIGIN", true),
      DEVICE_TOKEN_SECRET: processString("DEVICE_TOKEN_SECRET", true),
      ACCOUNT_TOKEN_SECRET: processString("ACCOUNT_TOKEN_SECRET", true),
      PROFILE_TOKEN_SECRET: processString("PROFILE_TOKEN_SECRET", true),
      ACCOUNT_ACCESS_TOKEN_DURATION: processNumber("ACCOUNT_ACCESS_TOKEN_DURATION", true),
      ACCOUNT_REFRESH_TOKEN_DURATION: processNumber("ACCOUNT_REFRESH_TOKEN_DURATION", true),
      PROFILE_ACCESS_TOKEN_DURATION: processNumber("PROFILE_ACCESS_TOKEN_DURATION", true),
      PROFILE_REFRESH_TOKEN_DURATION: processNumber("PROFILE_REFRESH_TOKEN_DURATION", true),
    }
    logger.success("Successfully Processed Server Environment")
    return serverEnvironment
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Processing Server Environment")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ServerConfig = {
  app: {
    NAME: string
  }
  client: {
    ORIGIN: string
  }
  secrets: {
    DEVICE_TOKEN_SECRET: string
    ACCOUNT_TOKEN_SECRET: string
    PROFILE_TOKEN_SECRET: string
  }
  tokens: {
    DEVICE_TOKEN_KEY: string
    ACCOUNT_ACCESS_TOKEN_DURATION: number
    ACCOUNT_REFRESH_TOKEN_DURATION: number
    PROFILE_ACCESS_TOKEN_DURATION: number
    PROFILE_REFRESH_TOKEN_DURATION: number
  }
}

function generateServerConfig(globalConfig: GlobalConfig): ServerConfig {
  try {
    logger.attempt("Generating Server Config")
    const serverEnvironment: ServerEnvironment = processServerEnvironment()
    const serverConfig: ServerConfig = {
      app: {
        NAME: globalConfig.APP_NAME
      },
      client: {
        ORIGIN: serverEnvironment.CLIENT_ORIGIN
      },
      secrets: {
        DEVICE_TOKEN_SECRET: serverEnvironment.DEVICE_TOKEN_SECRET,
        ACCOUNT_TOKEN_SECRET: serverEnvironment.ACCOUNT_TOKEN_SECRET,
        PROFILE_TOKEN_SECRET: serverEnvironment.PROFILE_TOKEN_SECRET
      },
      tokens: {
        DEVICE_TOKEN_KEY: `${globalConfig.APP_NAME}_deviceToken`,
        ACCOUNT_ACCESS_TOKEN_DURATION: serverEnvironment.ACCOUNT_ACCESS_TOKEN_DURATION,
        ACCOUNT_REFRESH_TOKEN_DURATION: serverEnvironment.ACCOUNT_REFRESH_TOKEN_DURATION,
        PROFILE_ACCESS_TOKEN_DURATION: serverEnvironment.PROFILE_ACCESS_TOKEN_DURATION,
        PROFILE_REFRESH_TOKEN_DURATION: serverEnvironment.PROFILE_REFRESH_TOKEN_DURATION
      }
    }
    logger.success("Successfully Generated Server Config")
    return serverConfig
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Server Config")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let serverConfig: ServerConfig
try { serverConfig = generateServerConfig(globalConfig) }
catch (object: unknown) { process.exit(0) }
export default serverConfig

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
