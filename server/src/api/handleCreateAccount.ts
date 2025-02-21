////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"
import {
  CreateAccountRawBody, CreateAccountValidBody,
  CreateAccountResponseData, CreateAccountHelperResult
} from "shared/types/api/CreateAccountTypes"

import { Account } from "@prisma/client"
import getAccountByEmail from "@/database/pure/getAccountByEmail"

import hashPassword from "@/utils/hashPassword"
import registerAccount from "@/database/pure/registerAccount"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Create Account"
const successMessage: string = "Successfully Handled Create Account"
const failureMessage: string = "Failed to Handle Create Account"
const serverErrorMessage: string = "Error Handling Create Account"
const clientErrorMessage: string = "Server Error"

// Objects
let responseData: CreateAccountResponseData
let helperResult: CreateAccountHelperResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Validation Functions

function validateName(name: string | undefined): ValidationResult {
  logger.attempt("Validating Name")
  if (!name || name.trim() === "") {
    const serverMessage: string = "Name is Undefined"
    const clientMessage: string = "Name is Required"
    logger.warning(serverMessage)
    logger.failure("Name is Invalid")
    return { success: false, message: clientMessage }
  }
  else {
    logger.success("Name is Valid")
    return { success: true }
  }
}

function validateEmail(email: string | undefined): ValidationResult {
  logger.attempt("Validating Email")
  if (!email) {
    const serverMessage: string = "Email is Undefined"
    const clientMessage: string = "Email is Required"
    logger.warning(serverMessage)
    logger.failure("Email is Invalid")
    return { success: false, message: clientMessage }
  }
  else {
    logger.success("Email is Valid")
    return { success: true }
  }
}

function validatePassword(password: string | undefined): ValidationResult {
  logger.attempt("Validating Password")
  if (!password) {
    const serverMessage: string = "Password is Undefined"
    const clientMessage: string = "Password is Required"
    logger.warning(serverMessage)
    logger.failure("Password is Invalid")
    return { success: false, message: clientMessage }
  }
  else {
    logger.success("Password is Valid")
    return { success: true }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateBody(body: CreateAccountRawBody): CreateAccountHelperResult {
  try {
    logger.attempt("Validating Body")

    const results: ValidationResult[] = []
    let result: ValidationResult
    result = validateName(body.name)
    results.push(result)
    result = validateEmail(body.email)
    results.push(result)
    result = validatePassword(body.password)
    results.push(result)

    const validationsResult: ValidationsResult = processValidationResults(results)
    
    if (validationsResult.valid) {
      logger.success("Body is Valid")
      const validBody = body as CreateAccountValidBody
      helperResult = { respond: false, data: validBody }
      return helperResult
    }
    else {
      const serverMessage: string = "Body is Invalid"
      const clientMessages: string[] = validationsResult.messages
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "invalid body", messages: clientMessages }
      helperResult = { respond: true, status: 400, data: responseData }
      return helperResult
    }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Validating Body")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateAccount(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = validateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = request.body as CreateAccountValidBody

    // Check Email Availability
    const existingAccount: Account | null = await getAccountByEmail(body.email)
    if (existingAccount !== null) {
      const message: string = "Email is Already Registered"
      logger.warning(message)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: message }
      return response.status(400).json(responseData)
    }
    logger.success("Email is Available")

    // Hash Password
    const hashedPassword: string = await hashPassword(body.password)

    // Register Account
    await registerAccount(body.name, body.email, hashedPassword)

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success" }
    return response.status(201).json(responseData)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(serverErrorMessage)
    logger.error(error)
    logger.trace(error)
    responseData = { type: "error", message: clientErrorMessage }
    return response.status(500).json(responseData)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
