////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/config/logger"
import prisma from "@/config/db"

import CreateAccountBody from "shared/types/CreateAccountBody"
import hashPassword from "@/utils/hashPassword"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateAccount(request: Request, response: Response) {
  const attemptMessage: string = "Creating Account"
  const successMessage: string = "Successfully Created Account"
  const failureMessage: string = "Failed to Create Account"
  try {
    logger.attempt(attemptMessage)

    logger.attempt("Validating Body")
    const body: CreateAccountBody = request.body
    if (!body.name || body.name.trim() === "") {
      const message: string = "Name is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(400).json({ message })
    }
    if (!body.email) {
      const message: string = "Email is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(400).json({ message })
    }
    if (!body.password) {
      const message: string = "Password is Required"
      logger.warning(message)
      logger.failure(failureMessage)
      return response.status(400).json({ message })
    }
    logger.success("Successfully Validated Body")

    logger.attempt("Checking Email Availability")
    const existingAccount = await prisma.accounts.findUnique({
      where: { email: body.email }
    })
    if (existingAccount !== null) {
      const message: string = "Email is Already Registered"
      logger.warning(message)
      logger.failure("Failed to Create Account")
      return response.status(400).json({ message })
    }
    logger.success("Email is Available")

    logger.attempt("Hashing Password")
    const hashedPassword: string = await hashPassword(body.password)
    logger.success("Successfully Hashed Password")

    logger.attempt("Registering Account in the Database")
    await prisma.accounts.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword
      }
    })
    logger.success("Successfully Registered Account in the Database")

    logger.success(successMessage)
    return response.status(201).json({ successMessage })
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(failureMessage)
    logger.error(error)
    logger.trace(error)
    return response.status(500).json({ message: "Server Error" })
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
