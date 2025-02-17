////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { EnsureDeviceTokenResult } from "shared/temp/EnsureDeviceToken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestEnsureDeviceToken() {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/ensureDeviceToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    const result: EnsureDeviceTokenResult = await response.json()
    if (response.status >= 200 && response.status < 300) { console.log(result.message) }
    else if (response.status >= 300 && response.status < 400) { console.log(result.message) }
    else if (response.status >= 400 && response.status < 500) { console.warn(result.message) }
    else if (response.status >= 500 && response.status < 600) { throw new Error(result.message) }
    else throw new Error("Unhandled Response")
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Processing Device Token")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
