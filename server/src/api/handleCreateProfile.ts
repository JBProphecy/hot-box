////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"
import {
  CreateProfileRawBody, CreateProfileValidBody,
  CreateProfileResponseData, CreateProfileHelperResult
} from "shared/types/api/CreateProfileTypes"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import getAccountAccessToken from "@/utils/account-token/getAccountAccessToken"

import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import verifyAccountAccessToken from "@/utils/account-token/verifyAccountAccessToken"

import { Profile } from "@prisma/client"
import getProfileByUsername from "@/database/pure/getProfileByUsername"

import hashPassword from "@/utils/hashPassword"
import registerProfile from "@/database/pure/registerProfile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Create Profile"
const successMessage: string = "Successfully Handled Create Profile"
const failureMessage: string = "Failed to Handle Create Profile"
const serverErrorMessage: string = "Error Handling Create Profile"
const clientErrorMessage: string = "Server Error"

// Objects
let responseData: CreateProfileResponseData
let helperResult: CreateProfileHelperResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateName(name: string | undefined): ValidationResult {
  try {
    logger.attempt("Validating Name")
    if (typeof name === "undefined") {
      const serverMessage: string = "Name is Undefined"
      const clientMessage: string = "Name is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      return { success: false, message: clientMessage }
    }
    logger.success("Name is Valid")
    return { success: true }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Validating Name")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function validateUsername(username: string | undefined): ValidationResult {
  try {
    logger.attempt("Validating Username")
    if (typeof username === "undefined") {
      const serverMessage: string = "Username is Undefined"
      const clientMessage: string = "Username is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      return { success: false, message: clientMessage }
    }
    logger.success("Username is Valid")
    return { success: true }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Validating Username")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function validatePassword(password: string | undefined): ValidationResult {
  try {
    logger.attempt("Validating Password")
    if (typeof password === "undefined") {
      const serverMessage: string = "Password is Undefined"
      const clientMessage: string = "Password is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      return { success: false, message: clientMessage }
    }
    logger.success("Password is Valid")
    return { success: true }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Validating Password")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function validateAccountID(accountID: string | undefined): ValidationResult {
  try {
    logger.attempt("Validating Account ID")
    if (typeof accountID === "undefined") {
      const serverMessage: string = "Account ID is Undefined"
      const clientMessage: string = "Account ID is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      return { success: false, message: clientMessage }
    }
    logger.success("Account ID is Valid")
    return { success: true }
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure("Error Validating Account ID")
    logger.error(error)
    logger.trace(error)
    throw error
  }
}

function validateBody(body: CreateProfileRawBody): CreateProfileHelperResult {
  try {
    logger.attempt("Validating Body")

    const results: ValidationResult[] = []
    let result: ValidationResult
    result = validateName(body.name)
    results.push(result)
    result = validateUsername(body.username)
    results.push(result)
    result = validatePassword(body.password)
    results.push(result)
    result = validateAccountID(body.accountID)
    results.push(result)

    const validationsResult: ValidationsResult = processValidationResults(results)
    
    if (validationsResult.valid) {
      logger.success("Body is Valid")
      const validBody = body as CreateProfileValidBody
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
    logger.failure(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleCreateProfile(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = validateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = helperResult.data as CreateProfileValidBody

    // Get Account Tokens
    const accountTokenKeys: AccountTokenKeys = generateAccountTokenKeys(body.accountID)
    const accountAccessToken: string | undefined = getAccountAccessToken(request, accountTokenKeys.accountAccessTokenKey)
    if (typeof accountAccessToken === "undefined") {
      const serverMessage: string = "Account Access Token is Undefined"
      const clientMessage: string = "Please Sign Into Your Account"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Successfully Retrieved Account Access Token")

    // Verify Account Access Token
    const accountAccessTokenPayload: AccountTokenPayload | "expired" | "invalid" = verifyAccountAccessToken(accountAccessToken)
    if (accountAccessTokenPayload === "expired") {
      const serverMessage: string = "Account Access Token is Expired"
      const clientMessage: string = "Please Sign Into Your Account"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    if (accountAccessTokenPayload === "invalid") {
      const serverMessage: string = "Account Access Token is Invalid"
      const clientMessage: string = "Please Sign Into Your Account"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Account Access Token is Valid")

    // Check Username Availability
    const existingProfile: Profile | null = await getProfileByUsername(body.username)
    if (existingProfile === null) {
      const message: string = "Username is Already Registered"
      logger.warning(message)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: message }
      return response.status(400).json(responseData)
    }
    logger.success("Username is Available")

    // Hash Password
    const hashedPassword: string = await hashPassword(body.password)

    // Register Profile
    await registerProfile(body.name, body.username, hashedPassword, body.accountID)

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
