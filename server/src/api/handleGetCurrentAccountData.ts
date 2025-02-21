////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { GetCurrentAccountDataRawBody, GetCurrentAccountDataResponseData } from "shared/types/api/GetCurrentAccountDataTypes"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import getAccountAccessToken from "@/utils/account-token/getAccountAccessToken"

import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import verifyAccountAccessToken from "@/utils/account-token/verifyAccountAccessToken"

import { CurrentAccountData } from "shared/types/data/private/CurrentAccountData"
import getCurrentAccountData from "@/database/private/getCurrentAccountData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Get Current Account Data"
const successMessage: string = "Successfully Handled Get Current Account Data"
const failureMessage: string = "Failed to Handle Get Current Account Data"
const serverErrorMessage: string = "Error Handling Get Current Account Data"
const clientErrorMessage: string = "Server Error"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Objects
let responseData: GetCurrentAccountDataResponseData

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleGetCurrentAccountData(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    logger.attempt("Validating Body")
    const body: GetCurrentAccountDataRawBody = request.body
    if (!body.accountID) {
      const serverMessage: string = "Account ID is Undefined"
      const clientMessage: string = "Account ID is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Body is Valid")

    // Get Account Access Token
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

    // Get Current Account Data
    const currentAccountData: CurrentAccountData | null = await getCurrentAccountData(accountAccessTokenPayload.accountID)
    if (currentAccountData === null) {
      const serverMessage: string = "Current Account Data is Null"
      const clientMessage: string = "Missing Account Data"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Successfully Retrieved Current Account Data")

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success", data: currentAccountData }
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
