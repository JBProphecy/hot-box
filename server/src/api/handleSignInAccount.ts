////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"
import { SignInAccountRequestBody, SignInAccountValidBody, SignInAccountResponseData, SignInAccountHelperResult } from "shared/types/SignInAccountTypes"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Account } from "@prisma/client"
import getAccountByEmail from "@/database/getAccountByEmail"

import verifyPassword from "@/utils/verifyPassword"

import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"

import AccountTokens from "@/types/account-token/AccountTokens"
import generateAccountTokens from "@/utils/account-token/generateAccountTokens"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"

import setAccountAccessTokenCookie from "@/utils/account-token/setAccountAccessTokenCookie"
import setAccountRefreshTokenCookie from "@/utils/account-token/setAccountRefreshTokenCookie"

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

function getValidationResults(body: SignInAccountRequestBody) {
  const results: ValidationResult[] = []
  let result: ValidationResult
  result = validateEmail(body.email)
  results.push(result)
  result = validatePassword(body.password)
  results.push(result)
  return results
}

function helperValidateBody(body: SignInAccountRequestBody): SignInAccountHelperResult {
  logger.attempt("Validating Body")
  let responseData: SignInAccountResponseData
  let helperResult: SignInAccountHelperResult
  const validationResults: ValidationResult[] = getValidationResults(body)
  const validationsResult: ValidationsResult = processValidationResults(validationResults)
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleSignInAccount(request: Request, response: Response) {
  // Messages
  const attemptMessage: string = "Handling Sign In Account"
  const successMessage: string = "Successfully Handled Sign In Account"
  const failureMessage: string = "Failed to Handle Sign in Account"
  const invalidCredentialsMessage: string = "Email and Password are Not Associated"

  // Helper Objects
  let responseData: SignInAccountResponseData
  let helperResult: SignInAccountHelperResult

  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = helperValidateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = helperResult.data as SignInAccountValidBody

    // Fetch Account
    logger.attempt("Fetching Account")
    const account: Account | null = await getAccountByEmail(body.email)
    if (account === null) {
      logger.warning("Email is Not Registered")
      logger.failure(failureMessage)
      responseData = { type: "failure", message: invalidCredentialsMessage}
      return response.status(400).json(responseData)
    }
    logger.success("Successfully Fetched Account")

    // Verify Password
    logger.attempt("Verifying Password")
    const match: boolean = await verifyPassword(account.password, body.password)
    if (!match) {
      logger.warning("Password is Invalid")
      logger.failure(failureMessage)
      responseData = { type: "failure", message: invalidCredentialsMessage}
      return response.status(400).json(responseData)
    }
    logger.success("Password is Valid")

    // Generate Account Tokens
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
    logger.failure("Error Signing In to Your Account")
    logger.error(error)
    logger.trace(error)
    responseData = { type: "error", message: "Server Error" }
    return response.status(500).json(responseData)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
