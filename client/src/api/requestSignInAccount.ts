////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { SignInAccountRawBody, SignInAccountResponseData } from "shared/types/api/SignInAccountTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Signing Into Your Account"
const successMessage: string = "Success Signing Into Your Account"
const failureMessage: string = "Failure Signing Into Your Account"
const errorMessage: string = "Error Siging Into Your Account"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type SignInAccountResult = {
  success: true
  accountID: string
} | {
  success: false
}

let result: SignInAccountResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestSignInAccount(body: SignInAccountRawBody): Promise<SignInAccountResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/accounts/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: SignInAccountResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true, accountID: data.accountID }
        return result
      case "failure":
        console.error(failureMessage)
        console.warn(data.message)
        result = { success: false }
        return result
      case "invalid body":
        console.error(failureMessage)
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
