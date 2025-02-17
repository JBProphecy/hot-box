////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import prisma from "@/config/db"

import hashPassword from "@/utils/hashPassword"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Helper, isResult } from "@/library/network"
import { CreateAccountRequestBody, CreateAccountValidBody, CreateAccountResponseData, CreateAccountResult } from "shared/types/CreateAccountTypes"
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

function getValidationResults(body: CreateAccountRequestBody): ValidationResult[] {
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

function validateBody(body: CreateAccountRequestBody): Helper {
  logger.attempt("Validating Body")

  const results: ValidationResult[] = getValidationResults(body)
  const result: ValidationsResult = processValidationResults(results)

  if (result.valid) {
    logger.success("Body is Valid")
    const validBody = body as CreateAccountValidBody
    return { respond: false, result: validBody }
  }
  else {
    logger.failure("Body is Invalid")
    const data: CreateAccountResponseData = { type: "invalid body", messages: result.messages }
    return { respond: true, result: { status: 400, data: data } }
  }
}

async function checkEmailAvailability(email: string): Promise<Helper> {
  try {
    logger.attempt("Checking Email Availability")
    const existingAccount = await prisma.account.findUnique({
      where: { email: email }
    })
    if (existingAccount !== null) {
      const message: string = "Email is Already Registered"
      logger.warning(message)
      const data: CreateAccountResponseData = { type: "failure", message: message }
      return { respond: true, result: { status: 400, data: data } }
    }
    else {
      logger.success("Email is Available")
      return { respond: false }
    }
  }
  catch (object: unknown) {
    logger.failure("Error Checking Email Availability")
    const error = object as Error
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

async function registerAccount(name: string, email: string, hashedPassword: string): Promise<Helper> {
  try {
    logger.attempt("Registering Account in the Database")
    await prisma.account.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    })
    logger.success("Successfully Registered Account in the Database")
    return { respond: false }
  }
  catch (object: unknown) {
    logger.failure("Error Registering Account in the Database")
    const error = object as Error
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateAccount(request: Request, response: Response) {
  // Helper Objects
  let data: CreateAccountResponseData
  let result: CreateAccountResult
  let helper: Helper

  try {
    // Initial Message
    logger.attempt("Creating Account")

    // Validate Body
    helper = validateBody(request.body)
    if (helper.respond) { throw helper.result }
    const body = helper.result as CreateAccountValidBody

    // Check Email Availability
    helper = await checkEmailAvailability(body.email)
    if (helper.respond) { throw helper.result }

    // Hash Password
    const hashedPassword: string = await hashPassword(body.password)

    // Register Account
    helper = await registerAccount(body.name, body.email, hashedPassword)
    if (helper.respond) { throw helper.result }

    logger.success("Successfully Created Account")
    data = { type: "success", message: "Successfully Created Account" }
    result = { status: 201, data: data }
    return response.status(result.status).json(result)
  }
  catch (object: unknown) {
    if (isResult(object)) {
      logger.failure("Failed to Create Account")
      result = object as CreateAccountResult
      return response.status(result.status).json(result)
    }
    logger.failure("Error Creating Account")
    const error = object as Error
    logger.error(error)
    logger.trace(error)
    data = { type: "error", message: "Server Error" }
    result = { status: 500, data: data }
    return response.status(result.status).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
