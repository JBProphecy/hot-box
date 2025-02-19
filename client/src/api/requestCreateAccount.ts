////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CreateAccountRequestBody, CreateAccountResponseData } from "shared/types/CreateAccountTypes"

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
    const result: CreateAccountResponseData = await response.json()
    switch (result.type) {
      case "invalid body":
        for (const message of result.messages) { console.warn(message) }
        break
      case "success": console.log(result.message); break
      case "failure": console.warn(result.message); break
      case "error": throw new Error(result.message)
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
