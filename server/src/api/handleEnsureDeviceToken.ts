////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NEEDS WORK

import logger from "@/library/logger"

import { Request, Response } from "express"
import { EnsureDeviceTokenResponseData, EnsureDeviceTokenResult } from "shared/types/EnsureDeviceTokenTypes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"

import generateDeviceID from "@/utils/device-token/generateDeviceID"
import generateDeviceToken from "@/utils/device-token/generateDeviceToken"

import setDeviceTokenCookie from "@/utils/device-token/setDeviceTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function handleEnsureDeviceToken(request: Request, response: Response) {
  // Messages
  const success: string = "Successfully Ensured Device Token"
  const failure: string = "Failed to Ensure Device Token"

  // Helper Objects
  let data: EnsureDeviceTokenResponseData
  let result: EnsureDeviceTokenResult
  let message: string

  try {
    logger.attempt("Ensuring Device Token")

    // Get Device Token
    logger.attempt("Fetching Device Token")
    let deviceToken: string | undefined = getDeviceToken(request)

    if (typeof deviceToken !== "undefined") {
      logger.success("Retrieved Device Token")
      // Verify Existing Device Token
      logger.attempt("Verifying Device Token")
      const deviceTokenPayload: DeviceTokenPayload | "expired" | "invalid" = verifyDeviceToken(deviceToken)
      if (deviceTokenPayload === "expired") {
        message = "Device Token is Expired"
        logger.warning(message)
        logger.failure(failure)
        data = { type: "failure", message: message }
        result = { status: 403, data: data }
        return response.status(result.status).json(result)
      }
      if (deviceTokenPayload === "invalid") {
        message = "Device Token is Invalid"
        logger.warning(message)
        logger.failure(failure)
        data = { type: "failure", message: message }
        result = { status: 403, data: data }
        return response.status(result.status).json(result)
      }
      logger.success("Device Token is Valid")
      logger.success(success)
      data = { type: "success", message: success }
      result = { status: 200, data: data }
      return response.status(result.status).json(result)
    }
    else {
      logger.warning("Missing Device Token")
      // Issue New Device Token
      const deviceID: string = generateDeviceID()
      const deviceTokenPayload: DeviceTokenPayload = { deviceID: deviceID }
      deviceToken = generateDeviceToken(deviceTokenPayload)
      setDeviceTokenCookie(response, deviceToken)
      logger.success(success)
      data = { type: "success", message: success }
      result = { status: 200, data: data}
      return response.status(result.status).json(result)
    }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Ensuring Device Token")
    logger.error(error)
    logger.trace(error)
    data = { type: "error", message: "Server Error" }
    result = { status: 500, data: data }
    return response.status(result.status).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
