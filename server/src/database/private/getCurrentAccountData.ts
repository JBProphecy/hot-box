////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { CurrentAccountData } from "shared/types/data/private/CurrentAccountData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getCurrentAccountData(id: string): Promise<CurrentAccountData | null> {
  try {
    logger.attempt("Getting Current Account Data")
    const currentAccountData: CurrentAccountData | null = await prisma.account.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
      }
    })
    return currentAccountData
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Public Account Data")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
