////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CurrentDeviceProfileData } from "shared/types/data/private/CurrentDeviceProfileData"
import { GetCurrentDeviceProfilesDataResponseData } from "shared/types/api/GetCurrentDeviceProfilesDataTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Getting Current Device Profiles Data"
const successMessage: string = "Successfully Retrieved Current Device Profiles Data"
const failureMessage: string = "Failed to Get Current Device Profiles Data"
const errorMessage: string = "Error Getting Current Device Profiles Data"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GetCurrentDeviceProfilesDataResult = {
  success: true
  data: CurrentDeviceProfileData[]
} | {
  success: false
}

let result: GetCurrentDeviceProfilesDataResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetCurrentDeviceProfileData(): Promise<GetCurrentDeviceProfilesDataResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/device/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })

    const data: GetCurrentDeviceProfilesDataResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true, data: data.data }
        return result
      case "failure":
        console.error(failureMessage)
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
