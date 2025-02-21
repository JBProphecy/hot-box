////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { GetCurrentDeviceProfilesDataResponseData } from "shared/types/api/GetCurrentDeviceProfilesDataTypes"

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"

import { CurrentDeviceProfileData } from "shared/types/data/private/CurrentDeviceProfileData"
import getDeviceProfileData from "@/database/private/getCurrentDeviceProfilesData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Get Device Profiles"
const successMessage: string = "Successfully Handled Get Device Profiles"
const failureMessage: string = "Failed to Handle Get Device Profiles"
const serverErrorMessage: string = "Error Handling Get Device Profiles"
const clientErrorMessage: string = "Server Error"

// Helper Objects
let responseData: GetCurrentDeviceProfilesDataResponseData

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleGetDeviceProfileData(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Get Device Token
    logger.attempt("Getting Device Token")
    const deviceToken: string | undefined = getDeviceToken(request)
    if (typeof deviceToken === "undefined") {
      const serverMessage: string = "Device Token is Undefined"
      const clientMessage: string = "Please Try Again"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Successfully Retrieved Device Token")

    // Verify Device Token
    logger.attempt("Verifying Device Token")
    const deviceTokenPayload: DeviceTokenPayload | "expired" | "invalid" = verifyDeviceToken(deviceToken)
    if (deviceTokenPayload === "expired") {
      const serverMessage: string = "Device Token is Expired"
      const clientMessage: string = "Please Try Again"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    if (deviceTokenPayload === "invalid") {
      const serverMessage: string = "Device Token is Invalid"
      const clientMessage: string = "Please Try Again"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Device Token is Valid")

    // Get Current Device Profiles Data
    const currentDeviceProfilesData: CurrentDeviceProfileData[] = await getDeviceProfileData(deviceTokenPayload.deviceID)

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success", data: currentDeviceProfilesData }
    return response.status(200).json(responseData)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(serverErrorMessage)
    logger.error(error)
    logger.trace(error)
    responseData = { type: "error", message: clientErrorMessage }
    return response.status(500).json(responseData)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
