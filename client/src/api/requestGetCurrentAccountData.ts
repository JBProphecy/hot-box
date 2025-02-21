////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { CurrentAccountData } from "shared/types/data/private/CurrentAccountData"
import { GetCurrentAccountDataRawBody, GetCurrentAccountDataResponseData } from "shared/types/api/GetCurrentAccountDataTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messagess
const attemptMessage: string = "Getting Current Account Data"
const successMessage: string = "Successfully Retrieved Current Account Data"
const failureMessage: string = "Failed to Get Current Account Data"
const errorMessage: string = "Error Getting Current Account Data"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GetCurrentAccountDataResult = {
  success: true
  data: CurrentAccountData
} | {
  success: false
}

let result: GetCurrentAccountDataResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetCurrentAccountData(body: GetCurrentAccountDataRawBody): Promise<GetCurrentAccountDataResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/current/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: GetCurrentAccountDataResponseData = await response.json()

    switch (data.type) {
      case "success":
        console.log(successMessage)
        result = { success: true, data: data.data }
        return result
      case "failure":
        console.warn(data.message)
        console.error(failureMessage)
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
