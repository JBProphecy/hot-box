////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { UUID } from "crypto"
import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import serverConfig from "@/config/env"
import logger from "@/config/logger"

import generateDeviceID from "@/utils/generateDeviceID"
import DeviceTokenPayload from "@/types/DeviceTokenPayload"
import generateDeviceToken from "@/utils/generateDeviceToken"
import verifyDeviceToken from "@/utils/verifyDeviceToken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_KEY: string = serverConfig.tokens.DEVICE_TOKEN_KEY

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleProcessDeviceToken(request: Request, response: Response) {
  try {
    const deviceToken: string | undefined = request.cookies[DEVICE_TOKEN_KEY]
    if (typeof deviceToken === "undefined") {
      const deviceID: UUID = generateDeviceID()
      const deviceTokenPayload: DeviceTokenPayload = { deviceID }
      const deviceToken: string = generateDeviceToken(deviceTokenPayload)
      response.cookie(DEVICE_TOKEN_KEY, deviceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 365 // One Year
      })
      const message: string = "A device token has been generated for you."
      logger.success(message)
      logger.message("deviceID:", deviceID)
      return response.status(200).json({ message })
    }
    const message: string = "You already have a device token."
    logger.success(message)
    const result = verifyDeviceToken(deviceToken)
    if (result === "expired") { logger.warning("Device Token is Expired") }
    else { logger.message("deviceID:", result.deviceID) }
    return response.status(200).json({ message })
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Processing Device Token")
    logger.error(error)
    logger.trace(error)
    return response.status(500).json({ message: "Server Error" })
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
