////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import { Account } from "@prisma/client"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function registerAccount(name: string, email: string, hashedPassword: string): Promise<Account> {
  try {
    logger.attempt("Registering Account in the Database")
    const account: Account = await prisma.account.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    })
    logger.success("Successfully Registered Account in the Database")
    return account
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Registering Account in the Database")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
