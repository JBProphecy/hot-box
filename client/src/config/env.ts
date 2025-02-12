////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { globalConfig } from "shared/config/env"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const processRequiredVariable = (name: string): string => {
  try {
    const value: string | undefined = import.meta.env[name]
    if (!value) { throw new Error(`${name} is Required and Undefined`) }
    return value
  }
  catch (object: unknown) { throw object }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ClientConfiguration = {
  app: {
    NAME: string
  },
  API: {
    URL: string
  },
  tokens: {
    account: {
      ACCESS_TOKEN_KEY: string
    },
    profile: {
      ACCESS_TOKEN_KEY: string
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateClientConfiguration(): ClientConfiguration {
  try {
    const clientConfig: ClientConfiguration = {
      app: {
        NAME: globalConfig.app.NAME
      },
      API: {
        URL: processRequiredVariable("VITE_API_URL")
      },
      tokens: {
        account: {
          ACCESS_TOKEN_KEY: `${globalConfig.app.NAME}_currentAccount_accessToken`
        },
        profile: {
          ACCESS_TOKEN_KEY: `${globalConfig.app.NAME}_currentProfile_accessToken`
        }
      }
    }
    return clientConfig
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Client Configuration Error")
    console.log(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const clientConfig: ClientConfiguration = generateClientConfiguration()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
