////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Account } from "@prisma/client"
import getAccountByEmail from "@/database/getAccountByEmail"
import registerAccount from "@/database/registerAccount"

import hashPassword from "@/utils/hashPassword"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { CreateAccountRequestBody, CreateAccountValidBody, CreateAccountResponseData } from "shared/types/CreateAccountTypes"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Validation Functions

function validateName(name: string | undefined): ValidationResult {
  logger.attempt("Validating Name")
  if (!name || name.trim() === "") {
    const warning: string = "Name is Required"
    logger.warning(warning)
    logger.failure("Name is Invalid")
    return { success: false, message: warning }
  }
  else {
    logger.success("Name is Valid")
    return { success: true }
  }
}

function validateEmail(email: string | undefined): ValidationResult {
  logger.attempt("Validating Email")
  if (!email) {
    const warning: string = "Email is Required"
    logger.warning(warning)
    logger.failure("Email is Invalid")
    return { success: false, message: warning }
  }
  else {
    logger.success("Email is Valid")
    return { success: true }
  }
}

function validatePassword(password: string | undefined): ValidationResult {
  logger.attempt("Validating Password")
  if (!password) {
    const warning: string = "Password is Required"
    logger.warning(warning)
    logger.failure("Password is Invalid")
    return { success: false, message: warning }
  }
  else {
    logger.success("Password is Valid")
    return { success: true }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateBody(body: CreateAccountRequestBody): ValidationResult[] {
  const results: ValidationResult[] = []
  let result: ValidationResult
  result = validateName(body.name)
  results.push(result)
  result = validateEmail(body.email)
  results.push(result)
  result = validatePassword(body.password)
  results.push(result)
  return results
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateAccount(request: Request, response: Response) {
  // Helper Objects
  let result: CreateAccountResponseData

  try {
    logger.attempt("Creating Account")

    // Validate Body
    try {
      logger.attempt("Validating Body")
      const validationResults: ValidationResult[] = validateBody(request.body)
      const validationsResult: ValidationsResult = processValidationResults(validationResults)
      if (!validationsResult.valid) {
        logger.failure("Body is Invalid")
        result = { status: 400, type: "invalid body", messages: validationsResult.messages }
        return response.status(result.status).json(result)
      }
      logger.success("Body is Valid")
    }
    catch (object: unknown) {
      const error = object as Error
      logger.failure("Error Validating Body")
      logger.error(error)
      logger.trace(error)
      throw error
    }
    const body = request.body as CreateAccountValidBody

    // Check Email Availability
    try {
      logger.attempt("Checking Email Availability")
      const account: Account | null = await getAccountByEmail(body.email)
      if (account !== null) {
        const message: string = "Email is Already Registered"
        logger.warning(message)
        logger.failure("Failed to Create Account")
        result = { status: 400, type: "failure", message: message }
        return response.status(result.status).json(result)
      }
      logger.success("Email is Available")
    }
    catch (object: unknown) {
      const error = object as Error
      logger.failure("Error Checking Email Availability")
      logger.error(error)
      logger.trace(error)
      throw error
    }

    // Hash Password
    const hashedPassword: string = await hashPassword(body.password)

    // Register Account
    const account: Account = await registerAccount(body.name, body.email, hashedPassword)

    const message: string = "Successfully Created Account"
    logger.success(message)
    result = { status: 201, type: "success", message: message }
    return response.status(result.status).json(result)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Creating Account")
    logger.error(error)
    logger.trace(error)
    result = { status: 500, type: "error", message: "Server Error" }
    return response.status(result.status).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
