////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { EnsureDeviceTokenResponseData } from "shared/types/api/EnsureDeviceTokenTypes"

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"
import generateDeviceID from "@/utils/device-token/generateDeviceID"
import generateDeviceToken from "@/utils/device-token/generateDeviceToken"
import setDeviceTokenCookie from "@/utils/device-token/setDeviceTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Ensure Device Token"
const successMessage: string = "Successfully Handled Ensure Device Token"
const failureMessage: string = "Failed to Handle Ensure Device Token"
const serverErrorMessage: string = "Error Handling Ensure Device Token"
const clientErrorMessage: string = "Server Error"

// Objects
let responseData: EnsureDeviceTokenResponseData

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleEnsureDeviceToken(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Get Device Token
    let deviceToken: string | undefined = getDeviceToken(request)
    if (typeof deviceToken === "undefined") {
      logger.warning("Device Token is Undefined")
      // Issue New Device Token
      const deviceID: string = generateDeviceID()
      const deviceTokenPayload: DeviceTokenPayload = { deviceID: deviceID }
      deviceToken = generateDeviceToken(deviceTokenPayload)
      setDeviceTokenCookie(response, deviceToken)
      logger.success(successMessage)
      responseData = { type: "success" }
      return response.status(200).json(responseData)
    }
    logger.success("Successfully Retrieved Device Token")

    // Verify Existing Device Token
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
    logger.success(successMessage)
    responseData = { type: "success" }
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
