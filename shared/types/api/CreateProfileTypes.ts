////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateProfileRawBody = {
  name?: string
  username?: string
  password?: string
  accountID?: string
}

export type CreateProfileValidBody = {
  name: string
  username: string
  password: string
  accountID: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateProfileResponseData = {
  type: "success"
} | {
  type: "failure" | "error"
  message: string
} | {
  type: "invalid body"
  messages: string[]
}

export type CreateProfileHelperResult = {
  respond: true
  status: number
  data: CreateProfileResponseData
} | {
  respond: false
  data?: unknown
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
