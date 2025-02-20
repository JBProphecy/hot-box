////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { PublicProfile } from "shared/types/data/public/PublicProfileData"
import { GetProfilesResponseData, GetProfilesResult } from "shared/types/api/GetProfilesTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetProfiles(): Promise<PublicProfile[]> {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/getProfiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
    const result: GetProfilesResult = await response.json()
    const data = result.data as GetProfilesResponseData
    switch (data.type) {
      case "success":
        console.log(data.message)
        return data.profiles
      case "error": throw new Error(data.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Fetching Profiles")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
