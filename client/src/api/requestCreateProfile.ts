////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CreateProfileRawBody, CreateProfileResponseData } from "shared/types/api/CreateProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Creating Profile"
const successMessage: string = "Successfully Created Profile"
const failureMessage: string = "Failed to Create Profile"
const errorMessage: string = "Error Creating Profile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type CreateProfileResult = { success: boolean }

let result: CreateProfileResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestCreateProfile(body: CreateProfileRawBody): Promise<CreateProfileResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/createProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: CreateProfileResponseData = await response.json()

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
