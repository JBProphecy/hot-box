////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { DeviceProfile } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getDeviceProfile(deviceID: string, profileID: string): Promise<DeviceProfile | null> {
  try {
    const deviceProfile: DeviceProfile | null = await prisma.deviceProfile.findUnique({
      where: {
        deviceID_profileID: {
          deviceID: deviceID,
          profileID: profileID
        }
      }
    })
    return deviceProfile
  }
  catch(object: unknown) {
    const error = object as Error
    logger.failure("Error Fetching Device Profile")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
