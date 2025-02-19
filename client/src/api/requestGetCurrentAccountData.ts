////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CurrentAccountData } from "shared/data/CurrentAccountData"
import { GetCurrentAccountDataRequestBody, GetCurrentAccountDataResponseData } from "shared/api/GetCurrentAccountDataTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetCurrentAccountData(body: GetCurrentAccountDataRequestBody): Promise<CurrentAccountData | null> {
  try {
    const response: Response = await fetch(`${clientConfig.API_URL}/current/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    const result: GetCurrentAccountDataResponseData = await response.json()
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
    console.error("Error Getting Current Account Data")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
