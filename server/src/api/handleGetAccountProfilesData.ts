////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { GetAccountProfilesResponseData } from "shared/types/api/GetAccountProfilesTypes"

import AccountTokenKeys from "@/types/account-token/AccountTokenKeys"
import generateAccountTokenKeys from "@/utils/account-token/generateAccountTokenKeys"
import getAccountAccessToken from "@/utils/account-token/getAccountAccessToken"

import AccountTokenPayload from "@/types/account-token/AccountTokenPayload"
import verifyAccountAccessToken from "@/utils/account-token/verifyAccountAccessToken"

import { AccountProfileData } from "shared/types/data/private/AccountProfileData"
import getAccountProfilesData from "@/database/private/getAccountProfilesData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Get Account Profiles Data"
const successMessage: string = "Successfully Handled Get Account Profiles Data"
const failureMessage: string = "Failed to Handle Get Account Profiles Data"
const serverErrorMessage: string = "Error Handling Get Account Profiles Data"
const clientErrorMessage: string = "Server Error"

// Helper Objects
let responseData: GetAccountProfilesResponseData

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleGetAccountProfilesData(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Get Account ID
    const accountID = request.headers["x-account-id"]
    if (typeof accountID === "undefined") {
      const serverMessage: string = "X-Account-ID is Undefined"
      const clientMessage: string = "Please Sign Into Your Account"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    if (Array.isArray(accountID)) { throw new Error("X-Account-ID has been Defined Multiple Times") }

    // Get Account Access Token
    const accountTokenKeys: AccountTokenKeys = generateAccountTokenKeys(accountID)
    const { accountAccessTokenKey, accountRefreshTokenKey } = accountTokenKeys
    const accountAccessToken: string | undefined = getAccountAccessToken(request, accountAccessTokenKey)
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

    // Get Account Profiles Data
    const accountProfilesData: AccountProfileData[] = await getAccountProfilesData(accountID)

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success", data: accountProfilesData }
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
