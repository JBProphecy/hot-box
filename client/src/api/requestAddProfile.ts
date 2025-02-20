////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { AddProfileRawBody, AddProfileResponseData } from "shared/api/AddProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Adding Profile to Your Device"
const successMessage: string = "Successfully Added Profile to Your Device"
const failureMessage: string = "Failed to Add Profile to Your Device"
const errorMessage: string = "Error Adding Profile to Your Device"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestAddProfile(body: AddProfileRawBody) {
  try {
    console.log(attemptMessage)
    const response: Response = await fetch(`${clientConfig.API_URL}/addProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: AddProfileResponseData = await response.json()
    switch (result.type) {
      case "invalid body":
        for (const message of result.messages) { console.warn(message) }
        return false
      case "success":
        console.log(successMessage)
        return true
      case "failure":
        console.warn(failureMessage)
        console.warn(result.message)
        return false
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
