////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { GetCurrentProfileDataRawBody, GetCurrentProfileDataResponseData } from "shared/types/api/GetCurrentProfileDataTypes"

import ProfileTokenKeys from "@/types/profile-token/ProfileTokenKeys"
import generateProfileTokenKeys from "@/utils/profile-token/generateProfileTokenKeys"
import getProfileAccessToken from "@/utils/profile-token/getProfileAccessToken"

import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"
import verifyProfileAccessToken from "@/utils/profile-token/verifyProfileAccessToken"

import { CurrentProfileData } from "shared/types/data/private/CurrentProfileData"
import getCurrentProfileData from "@/database/private/getCurrentProfileData"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Get Current Profile Data"
const successMessage: string = "Successfully Handled Get Current Profile Data"
const failureMessage: string = "Failed to Handle Get Current Profile Data"
const serverErrorMessage: string = "Error Handling Get Current Profile Data"
const clientErrorMessage: string = "Server Error"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Objects
let responseData: GetCurrentProfileDataResponseData

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleGetCurrentProfileData(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    logger.attempt("Validating Body")
    const body: GetCurrentProfileDataRawBody = request.body
    if (!body.profileID) {
      const serverMessage: string = "Profile ID is Undefined"
      const clientMessage: string = "Profile ID is Required"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Body is Valid")

    // Get Profile Access Token
    const profileTokenKeys: ProfileTokenKeys = generateProfileTokenKeys(body.profileID)
    const profileAccessToken: string | undefined = getProfileAccessToken(request, profileTokenKeys.profileAccessTokenKey)
    if (typeof profileAccessToken === "undefined") {
      const serverMessage: string = "Profile Access Token is Undefined"
      const clientMessage: string = "Please Sign Into Your Profile"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }

    // Verify Profile Access Token
    const profileAccessTokenPayload: ProfileTokenPayload | "expired" | "invalid" = verifyProfileAccessToken(profileAccessToken)
    if (profileAccessTokenPayload === "expired") {
      const serverMessage: string = "Profile Access Token is Expired"
      const clientMessage: string = "Please Sign Into Your Profile"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    if (profileAccessTokenPayload === "invalid") {
      const serverMessage: string = "Profile Access Token is Invalid"
      const clientMessage: string = "Please Sign Into Your Profile"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Profile Access Token is Valid")

    // Get Current Profile Data
    const currentProfileData: CurrentProfileData | null = await getCurrentProfileData(profileAccessTokenPayload.profileID)
    if (currentProfileData === null) {
      const serverMessage: string = "Current Profile Data is Null"
      const clientMessage: string = "Missing Profile Data"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Successfully Retrieved Current Profile Data")

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success", data: currentProfileData }
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
