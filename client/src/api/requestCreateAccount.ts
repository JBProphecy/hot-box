////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CreateAccountRawBody, CreateAccountResponseData } from "shared/types/api/CreateAccountTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Creating Account"
const successMessage: string = "Successfully Created Account"
const failureMessage: string = "Failed to Create Account"
const errorMessage: string = "Error Creating Account"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateAccountResult = { success: boolean }

let result: CreateAccountResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestCreateAccount(body: CreateAccountRawBody): Promise<CreateAccountResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/createAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: CreateAccountResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true }
        return result
      case "failure":
        console.warn(failureMessage)
        console.warn(data.message)
        result = { success: false }
        return result
      case "invalid body":
        console.warn(failureMessage)
        for (const message of data.messages) { console.warn(message) }
        result = { success: false }
        return result
      case "error": throw new Error(data.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error(errorMessage)
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
