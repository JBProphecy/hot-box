////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { globalConfig } from "shared/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const processRequiredVariable = (name: string): string => {
  try {
    const value: string | undefined = process.env[name]
    if (!value) { throw new Error(`${name} is Required and Undefined`) }
    return value
  }
  catch (object: unknown) { throw object }
}

const processTokenDuration = (name: string): number => {
  const value: string | undefined = process.env[name]
  const duration: number = value ? parseInt(value) : 0
  return duration
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ServerConfiguration = {
  app: {
    NAME: string
  },
  client: {
    ORIGIN: string
  },
  db: {
    HOST: string,
    USER: string,
    PASSWORD: string,
    DATABASE: string
  },
  security: {
    CRYPTO_KEY: string,
    JWT_SECRET: string
  }
  tokens: {
    account: {
      ACCESS_TOKEN_DURATION: number,
      REFRESH_TOKEN_DURATION: number,
      REFRESH_TOKEN_KEY: string
    },
    profile: {
      ACCESS_TOKEN_DURATION: number,
      REFRESH_TOKEN_DURATION: number,
      REFRESH_TOKEN_KEY: string
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateServerConfiguration(): ServerConfiguration {
  try {
    const serverConfig: ServerConfiguration = {
      app: {
        NAME: globalConfig.app.NAME
      },
      client: {
        ORIGIN: processRequiredVariable("CLIENT_ORIGIN")
      },
      db: {
        HOST: processRequiredVariable("DB_HOST"),
        USER: processRequiredVariable("DB_USER"),
        PASSWORD: processRequiredVariable("DB_PASS"),
        DATABASE: processRequiredVariable("DB_NAME")
      },
      security: {
        CRYPTO_KEY: processRequiredVariable("CRYPTO_KEY"),
        JWT_SECRET: processRequiredVariable("JWT_SECRET")
      },
      tokens: {
        account: {
          ACCESS_TOKEN_DURATION: processTokenDuration("ACCOUNT_ACCESS_TOKEN_DURATION"),
          REFRESH_TOKEN_DURATION: processTokenDuration("ACCOUNT_REFRESH_TOKEN_DURATION"),
          REFRESH_TOKEN_KEY: `${globalConfig.app.NAME}_currentAccount_refreshToken`
        },
        profile: {
          ACCESS_TOKEN_DURATION: processTokenDuration("PROFILE_ACCESS_TOKEN_DURATION"),
          REFRESH_TOKEN_DURATION: processTokenDuration("PROFILE_REFRESH_TOKEN_DURATION"),
          REFRESH_TOKEN_KEY: `${globalConfig.app.NAME}_currentProfile_refreshToken`
        }
      }
    }
    return serverConfig
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Server Configuration Error")
    console.log(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const serverConfig: ServerConfiguration = generateServerConfiguration()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
