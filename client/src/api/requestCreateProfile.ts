////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CreateProfileBody, CreateProfileResult } from "shared/temp/CreateProfileResult"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestCreateProfile(body: CreateProfileBody) {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/createProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: CreateProfileResult = await response.json()
    if (response.status >= 200 && response.status < 300) { console.log(result.message) }
    else if (response.status >= 300 && response.status < 400) { console.log(result.message) }
    else if (response.status >= 400 && response.status < 500) { console.warn(result.message) }
    else if (response.status >= 500 && response.status < 600) { throw new Error(result.message) }
    else throw new Error("Unhandled Response")
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Creating Profile")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
