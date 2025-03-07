////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import prisma from "@/config/db"
import logger from "@/library/logger"

import { Profile } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    logger.attempt("Getting Profile By Username")
    const profile: Profile | null = await prisma.profile.findUnique({
      where: { username: username }
    })
    return profile
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Profile By Username")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
