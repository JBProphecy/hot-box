////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CurrentProfileData } from "shared/types/data/private/CurrentProfileData"
import { GetCurrentProfileDataRequestBody, GetCurrentProfileDataResponseData } from "shared/types/api/GetCurrentProfileDataTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetCurrentProfileData(body: GetCurrentProfileDataRequestBody): Promise<CurrentProfileData | null> {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/current/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: GetCurrentProfileDataResponseData = await response.json()
    switch (result.type) {
      case "success":
        return result.data
      case "failure":
        console.warn(result.message)
        return null
      case "error": throw new Error(result.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Getting Current Profile Data")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
