////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CreateAccountRequestBody, CreateAccountResponseData, CreateAccountResult } from "shared/types/CreateAccountTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestCreateAccount(body: CreateAccountRequestBody) {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/createAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: CreateAccountResult = await response.json()
    const data = result.data as CreateAccountResponseData
    switch (data.type) {
      case "invalid body":
        for (const message of data.messages) { console.warn(message) }
        break
      case "success": console.log(data.message); break
      case "failure": console.warn(data.message); break
      case "error": throw new Error(data.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Creating Account")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
