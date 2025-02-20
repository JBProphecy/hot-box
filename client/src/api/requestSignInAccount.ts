////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { SignInAccountRequestBody, SignInAccountResponseData } from "shared/types/api/SignInAccountTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Signing Into Your Account"
const successMessage: string = "Success Signing Into Your Account"
const failureMessage: string = "Failure Signing Into Your Account"
const errorMessage: string = "Error Siging Into Your Account"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestSignInAccount(body: SignInAccountRequestBody): Promise<string | null> {
  try {
    console.log(attemptMessage)
    const response: Response = await fetch(`${clientConfig.API_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: SignInAccountResponseData = await response.json()
    switch (result.type) {
      case "invalid body":
        console.warn(failureMessage)
        for (const message of result.messages) { console.warn(message) }
        return null
      case "success":
        console.log(successMessage)
        return result.accountID
      case "failure":
        console.warn(failureMessage)
        console.warn(result.message)
        return null
      case "error": throw new Error(result.message)
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
