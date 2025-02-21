////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CurrentProfileData } from "shared/types/data/private/CurrentProfileData"
import { GetCurrentProfileDataRawBody, GetCurrentProfileDataResponseData } from "shared/types/api/GetCurrentProfileDataTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messagess
const attemptMessage: string = "Getting Current Profile Data"
const successMessage: string = "Successfully Retrieved Current Profile Data"
const failureMessage: string = "Failed to Get Current Profile Data"
const errorMessage: string = "Error Getting Current Profile Data"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GetCurrentProfileDataResult = {
  success: true
  data: CurrentProfileData
} | {
  success: false
}

let result: GetCurrentProfileDataResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetCurrentProfileData(body: GetCurrentProfileDataRawBody): Promise<GetCurrentProfileDataResult> {
  try {
    console.log(attemptMessage)
    
    const response: Response = await fetch(`${clientConfig.API_URL}/current/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: GetCurrentProfileDataResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true, data: data.data }
        return result
      case "failure":
        console.warn(failureMessage)
        console.warn(data.message)
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
