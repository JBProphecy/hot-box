////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type GlobalEnvironment = {
  APP_NAME: string
}

const globalEnvironment: GlobalEnvironment = {
  APP_NAME: "HotBaux" // No Spaces
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GlobalConfig = {
  APP_NAME: string,
  CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: string,
  CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: string
  CURRENT_PROFILE_ACCESS_TOKEN_KEY: string,
  CURRENT_PROFILE_REFRESH_TOKEN_KEY: string
}

export const globalConfig: GlobalConfig = {
  APP_NAME: globalEnvironment.APP_NAME,
  CURRENT_ACCOUNT_ACCESS_TOKEN_KEY: `${globalEnvironment.APP_NAME}_currentAccount_accessToken`,
  CURRENT_ACCOUNT_REFRESH_TOKEN_KEY: `${globalEnvironment.APP_NAME}_currentAccount_refreshToken`,
  CURRENT_PROFILE_ACCESS_TOKEN_KEY: `${globalEnvironment.APP_NAME}_currentProfile_accessToken`,
  CURRENT_PROFILE_REFRESH_TOKEN_KEY: `${globalEnvironment.APP_NAME}_currentProfile_refreshToken`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
