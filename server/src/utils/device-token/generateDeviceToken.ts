////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import jwt from "jsonwebtoken"
import logger from "@/library/logger"
import serverConfig from "@/config/env"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEVICE_TOKEN_SECRET: string = serverConfig.secrets.DEVICE_TOKEN_SECRET

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function generateDeviceToken(payload: DeviceTokenPayload): string {
  try {
    logger.attempt("Generating Device Token")
    const deviceToken: string = jwt.sign(payload, DEVICE_TOKEN_SECRET)
    logger.success("Successfully Generated Device Token")
    return deviceToken
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Generating Device Token")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
