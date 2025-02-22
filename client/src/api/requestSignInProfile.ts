////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { SignInProfileRawBody, SignInProfileResponseData } from "shared/types/api/SignInProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Signing Into Your Profile"
const successMessage: string = "Successfully Signed Into Your Profile"
const failureMessage: string = "Failed to Sign Into Your Profile"
const errorMessage: string = "Error Signing Into Your Profile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type SignInProfileResult = {
  success: true
  profileID: string
} | {
  success: false
}

let result: SignInProfileResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestSignInProfile(body: SignInProfileRawBody): Promise<SignInProfileResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/profiles/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: SignInProfileResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true, profileID: data.profileID }
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
