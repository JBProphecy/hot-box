////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { Profile } from "@prisma/client"
import { AccountProfileData } from "shared/types/data/private/AccountProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getAccountProfilesData(accountID: string): Promise<AccountProfileData[]> {
  try {
    logger.attempt("Getting Account Profiles Data")

    const profileIDs: string[] = await prisma.profile.findMany({
      where: { accountID: accountID },
      select: { id: true }
    }).then(profiles => profiles.map(profile => profile.id))

    const profiles: Profile[] = await prisma.profile.findMany({
      where: { id: { in: profileIDs }},
    })

    const accountProfilesData: AccountProfileData[] = profiles.map(profile => ({
        profileID: profile.id,
        profileName: profile.name,
        profileUsername: profile.username
    }))

    return accountProfilesData
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Account Profiles Data")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
