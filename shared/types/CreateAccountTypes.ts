////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateAccountRequestBody = {
  name?: string
  email?: string
  password?: string
}

export type CreateAccountValidBody = {
  name: string,
  email: string,
  password: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateAccountResponseData = {
  type: "success" | "failure" | "error"
  message: string
} | {
  type: "invalid body"
  messages: string[]
}

export type CreateAccountResult = {
  status: number,
  data: CreateAccountResponseData
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
