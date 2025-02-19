////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { SignInProfileRawBody, SignInProfileResponseData } from "shared/api/SignInProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Signing Into Your Profile"
const successMessage: string = "Success Signing Into Your Profile"
const failureMessage: string = "Failure Signing Into Your Profile"
const errorMessage: string = "Error Signing Into Your Profile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestSignInProfile(body: SignInProfileRawBody): Promise<string | null> {
  try {
    console.log(attemptMessage)
    const response: Response = await fetch(`${clientConfig.API_URL}/profile/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: SignInProfileResponseData = await response.json()
    switch (result.type) {
      case "invalid body":
        console.warn(failureMessage)
        for (const message of result.messages) { console.warn(message) }
        return null
      case "success":
        console.log(successMessage)
        return result.profileID
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
