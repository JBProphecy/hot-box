////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import serverConfig from "@/config/env"

import verifyToken from "@/utils/verifyToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"

import { JwtPayload } from "jsonwebtoken"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_SECRET: string = serverConfig.secrets.DEVICE_TOKEN_SECRET

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function verifyDeviceToken(deviceToken: string): DeviceTokenPayload | "expired" | "invalid" {
  try {
    const payload: JwtPayload | "expired" | "invalid" = verifyToken(deviceToken, DEVICE_TOKEN_SECRET)
    if (payload !== "expired" && payload !== "invalid") { return payload as DeviceTokenPayload }
    return payload
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Verifying Device Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
