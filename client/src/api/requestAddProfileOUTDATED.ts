////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { AddProfileRequestBody, AddProfileResponseData, AddProfileResult } from "shared/types/AddProfileTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestAddProfile(body: AddProfileRequestBody) {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/addProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: AddProfileResult = await response.json()
    const data = result.data as AddProfileResponseData
    switch (data.type) {
      case "invalid body":
        for (const message of data.messages) { console.warn(message) }
        break
      case "success": console.log(data.message); break
      case "failure": console.warn(data.message); break
      case "error": throw new Error(data.message)
      default: throw new Error("Unhandled Response")
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Adding Profile to Your Device")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
