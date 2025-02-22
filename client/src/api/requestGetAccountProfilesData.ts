////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import { GetAccountProfilesRawBody, GetAccountProfilesResponseData } from "shared/types/api/GetAccountProfilesTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messagess
const attemptMessage: string = "Getting Account Profiles Data"
const successMessage: string = "Successfully Retrieved Account Profiles Data"
const failureMessage: string = "Failed to Get Account Profiles Data"
const errorMessage: string = "Error Getting Account Profiles Data"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type GetAccountProfilesDataResult = {
  success: true
  data: AccountProfileData[]
} | {
  success: false
}

let result: GetAccountProfilesDataResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function requestGetAccountProfilesData(body: GetAccountProfilesRawBody): Promise<GetAccountProfilesDataResult> {
  try {
    console.log(attemptMessage)

    const response: Response = await fetch(`${clientConfig.API_URL}/current/account/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })

    const data: GetAccountProfilesResponseData = await response.json()

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
