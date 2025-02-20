////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { PublicProfileData } from "shared/types/data/public/PublicProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getPublicProfileData(id: string): Promise<PublicProfileData | null> {
  try {
    logger.attempt("Getting Current Profile Data")
    const publicProfileData: PublicProfileData | null = await prisma.profile.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        username: true
      }
    })
    return publicProfileData
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
