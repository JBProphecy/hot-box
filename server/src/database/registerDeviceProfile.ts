////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { DeviceProfile } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function registerDeviceProfile(deviceID: string, profileID: string): Promise<DeviceProfile> {
  try {
    logger.attempt("Registering Device Profile")
    const deviceProfile: DeviceProfile = await prisma.deviceProfile.create({
      data: {
        deviceID: deviceID,
        profileID: profileID
      }
    })
    logger.success("Successfully Registered Device Profile")
    return deviceProfile
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Registering Device Profile")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
