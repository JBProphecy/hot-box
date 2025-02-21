////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { EnsureDeviceTokenResponseData } from "shared/types/api/EnsureDeviceTokenTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Ensuring Device Token"
const successMessage: string = "Successfully Ensured Device Token"
const failureMessage: string = "Failed to Ensure Device Token"
const errorMessage: string = "Error Ensuring Device Token"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type EnsureDeviceTokenResult = { success: boolean }

let result: EnsureDeviceTokenResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestEnsureDeviceToken(): Promise<EnsureDeviceTokenResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/ensureDeviceToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    const data: EnsureDeviceTokenResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true }
        return result
      case "failure":
        console.warn(data.message)
        console.error(failureMessage)
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
