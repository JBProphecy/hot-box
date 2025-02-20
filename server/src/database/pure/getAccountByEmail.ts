////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { Account } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function getAccountByEmail(email: string): Promise<Account | null> {
  try {
    logger.attempt("Getting Account By Email")
    const account: Account | null = await prisma.account.findUnique({
      where: { email: email }
    })
    return account
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Getting Account By Email")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
