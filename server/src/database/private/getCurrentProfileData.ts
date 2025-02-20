////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { CurrentProfileData } from "shared/types/data/private/CurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getCurrentProfileData(id: string): Promise<CurrentProfileData | null> {
  try {
    logger.attempt("Getting Current Profile Data")
    const currentProfileData: CurrentProfileData | null = await prisma.profile.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        username: true
      }
    })
    return currentProfileData
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Public Profile Data")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
