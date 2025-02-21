////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"
import {
  SignInAccountRawBody, SignInAccountValidBody,
  SignInAccountResponseData, SignInAccountHelperResult
} from "shared/types/api/SignInAccountTypes"

import { Account } from "@prisma/client"
import getAccountByEmail from "@/database/pure/getAccountByEmail"

import verifyPassword from "@/utils/verifyPassword"

import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import AccountTokens from "@/types/account-token/AccountTokens"
import generateAccountTokens from "@/utils/account-token/generateAccountTokens"
import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import setAccountAccessTokenCookie from "@/utils/account-token/setAccountAccessTokenCookie"
import setAccountRefreshTokenCookie from "@/utils/account-token/setAccountRefreshTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Sign In Account"
const successMessage: string = "Successfully Handled Sign In Account"
const failureMessage: string = "Failed to Handle Sign In Account"
const serverErrorMessage: string = "Error Handling Sign In Account"
const clientErrorMessage: string = "Server Error"
const invalidCredentialsMessage: string = "Email and Password are Not Associated"

// Objects
let responseData: SignInAccountResponseData
let helperResult: SignInAccountHelperResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateEmail(email: string | undefined): ValidationResult {
  let result: ValidationResult
  if (typeof email === "undefined") {
    const message: string = "Email is Required"
    result = { success: false, message: message }
    return result
  }
  result = { success: true }
  return result
}

function validatePassword(password: string | undefined): ValidationResult {
  let result: ValidationResult
  if (typeof password === "undefined") {
    const message: string = "Password is Required"
    result = { success: false, message: message }
    return result
  }
  result = { success: true }
  return result
}

function validateBody(body: SignInAccountRawBody): SignInAccountHelperResult {
  try {
    logger.attempt("Validating Body")

    const results: ValidationResult[] = []
    let result: ValidationResult
    result = validateEmail(body.email)
    results.push(result)
    result = validatePassword(body.password)
    results.push(result)
  
    const validationsResult: ValidationsResult = processValidationResults(results)
  
    if (!validationsResult.valid) {
      logger.failure("Body is Invalid")
      responseData = { type: "invalid body", messages: validationsResult.messages }
      helperResult = { respond: true, status: 400, data: responseData }
      return helperResult
    }
    logger.success("Body is Valid")
    const validBody = body as SignInAccountValidBody
    helperResult = { respond: false, data: validBody }
    return helperResult
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

export default async function handleSignInAccount(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = validateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = helperResult.data as SignInAccountValidBody

    // Get Account By Email
    const account: Account | null = await getAccountByEmail(body.email)
    if (account === null) {
      const serverMessage: string = "Account Not Found"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: invalidCredentialsMessage}
      return response.status(400).json(responseData)
    }
    logger.success("Successfully Retrieved Account")

    // Verify Password
    const match: boolean = await verifyPassword(account.password, body.password)
    if (!match) {
      const serverMessage: string = "Passwords Don't Match"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: invalidCredentialsMessage}
      return response.status(400).json(responseData)
    }
    logger.success("Password is Valid")

    // Process Account Tokens
    const accountTokenPayload: AccountTokenPayload = { accountID: account.id }
    const { accountAccessToken, accountRefreshToken }: AccountTokens = generateAccountTokens(accountTokenPayload)
    const { accountAccessTokenKey, accountRefreshTokenKey}: AccountTokenKeys = generateAccountTokenKeys(account.id)
    setAccountAccessTokenCookie(response, accountAccessTokenKey, accountAccessToken)
    setAccountRefreshTokenCookie(response, accountRefreshTokenKey, accountRefreshToken)

    logger.success(successMessage)
    responseData = { type: "success", accountID: account.id }
    return response.status(200).json(responseData)
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
