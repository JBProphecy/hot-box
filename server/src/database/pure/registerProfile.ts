////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { Profile } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function registerProfile(name: string, username: string, password: string, accountID: string): Promise<Profile> {
  try {
    logger.attempt("Registering Profile")
    const profile: Profile = await prisma.profile.create({
      data: {
        name: name,
        username: username,
        password: password,
        accountID: accountID
      }
    })
    logger.success("Successfully Registered Profile")
    return profile
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Registering Profile")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
