////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { CurrentProfileData } from "shared/data/CurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getDeviceProfileData(deviceID: string): Promise<CurrentProfileData[]> {
  try {
    logger.attempt("Getting Device Profile Data")

    const profileIDs = await prisma.deviceProfile.findMany({
      where: { deviceID: deviceID },
      select: { profileID: true }
    }).then(profiles => profiles.map(profile => profile.profileID))
    
    const deviceProfileData: CurrentProfileData[] = await prisma.profile.findMany({
      where: { id: { in: profileIDs }},
      select: {
        id: true,
        name: true,
        username: true
      }
    })

    logger.success("Successfully Retrived Device Profile Data")
    return deviceProfileData
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Device Profile Data")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
