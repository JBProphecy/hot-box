////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"

import { GetDeviceProfilesResponseData } from "shared/types/api/GetDeviceProfilesTypes"
import { CurrentProfileData } from "shared/data/private/CurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetDeviceProfileData(): Promise<CurrentProfileData[]> {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/device/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    const result: GetDeviceProfilesResponseData = await response.json()
    switch (result.type) {
      case "success":
        console.log("Successfully Retrieved Device Profiles")
        return result.data
      case "failure":
        console.warn(result.message)
        return []
      case "error": throw new Error(result.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Getting Device Profiles")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
