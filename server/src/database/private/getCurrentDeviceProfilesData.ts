////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { CurrentDeviceProfileData } from "shared/types/data/private/CurrentDeviceProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getCurrentDeviceProfileData(deviceID: string): Promise<CurrentDeviceProfileData[]> {
  try {
    logger.attempt("Getting Device Profile Data")

    const profileIDs = await prisma.deviceProfile.findMany({
      where: { deviceID: deviceID },
      select: { profileID: true }
    }).then(profiles => profiles.map(profile => profile.profileID))
    
    const currentDeviceProfilesData: CurrentDeviceProfileData[] = await prisma.profile.findMany({
      where: { id: { in: profileIDs }},
      select: {
        id: true,
        name: true,
        username: true
      }
    })

    logger.success("Successfully Retrived Device Profile Data")
    return currentDeviceProfilesData
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
