////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { globalConfig, GlobalConfig } from "shared/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processString(key: string, required: true): string
function processString(key: string, required?: false): string | undefined
function processString(key: string, required?: boolean): string | undefined {
  const value: string | undefined = import.meta.env[key]
  if (typeof value !== "undefined") { return value }
  if (!required) { return undefined }
  throw new Error(`${key} is Required and Undefined`)
}

/*
function processNumber(key: string, required: true): number
function processNumber(key: string, required?: false): number | undefined
function processNumber(key: string, required?: boolean): number | undefined {
  const value: string | undefined = import.meta.env[key]
  if (typeof value !== "undefined") {
    const number = parseInt(value, 10)
    if (!isNaN(number)) { return number }
    throw new Error(`${key} = "${value}" and "${value}" is Not a Number`)
  }
  if (!required) { return undefined }
  throw new Error(`${key} is Required and Undefined`)
}
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ClientEnvironment = {
  VITE_API_URL: string
}

function processClientEnvironment(): ClientEnvironment {
  try {
    const clientEnvironment: ClientEnvironment = {
      VITE_API_URL: processString("VITE_API_URL", true)
    }
    return clientEnvironment
  }
  catch (object: unknown) {
    const error = object as Error
    console.log("Error Processing Client Environment")
    console.log(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ClientConfig = {
  API_URL: string,
  APP_NAME: string,
  CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: string,
  CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: string
  CURRENT_PROFILE_ACCESS_TOKEN_KEY: string,
  CURRENT_PROFILE_REFRESH_TOKEN_KEY: string
}

function generateClientConfig(globalConfig: GlobalConfig): ClientConfig {
  try {
    const clientEnvironment: ClientEnvironment = processClientEnvironment()
    const clientConfig: ClientConfig = {
      API_URL: clientEnvironment.VITE_API_URL,
      APP_NAME: globalConfig.APP_NAME,
      CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: globalConfig.CURRENT_ACCOUNT_ACCESS_TOKEN_KEY,
      CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: globalConfig.CURRENT_ACCOUNT_REFRESH_TOKEN_KEY,
      CURRENT_PROFILE_ACCESS_TOKEN_KEY: globalConfig.CURRENT_PROFILE_ACCESS_TOKEN_KEY,
      CURRENT_PROFILE_REFRESH_TOKEN_KEY: globalConfig.CURRENT_PROFILE_REFRESH_TOKEN_KEY
    }
    return clientConfig
  }
  catch (object: unknown) {
    const error = object as Error
    console.log("Error Generating Client Config")
    console.log(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const clientConfig: ClientConfig = generateClientConfig(globalConfig)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default clientConfig

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
