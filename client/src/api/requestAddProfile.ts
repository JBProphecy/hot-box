////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { AddProfileRawBody, AddProfileResponseData } from "shared/types/api/AddProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Adding Profile to Your Device"
const successMessage: string = "Successfully Added Profile to Your Device"
const failureMessage: string = "Failed to Add Profile to Your Device"
const errorMessage: string = "Error Adding Profile to Your Device"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AddProfileResult = { success: boolean }

let result: AddProfileResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestAddProfile(body: AddProfileRawBody): Promise<AddProfileResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/device/profiles/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: AddProfileResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true }
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
