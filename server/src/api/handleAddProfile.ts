////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"
import {
  AddProfileRawBody, AddProfileValidBody,
  AddProfileResponseData, AddProfileHelperResult
} from "shared/types/api/AddProfileTypes"

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"

import { Profile } from "@prisma/client"
import getProfileByUsername from "@/database/pure/getProfileByUsername"
import verifyPassword from "@/utils/verifyPassword"

import { DeviceProfile } from "@prisma/client"
import getDeviceProfile from "@/database/pure/getDeviceProfile"
import registerDeviceProfile from "@/database/pure/registerDeviceProfile"

import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"
import ProfileTokens from "@/types/profile-token/ProfileTokens"
import generateProfileTokens from "@/utils/profile-token/generateProfileTokens"
import ProfileTokenKeys from "@/types/profile-token/ProfileTokenKeys"
import generateProfileTokenKeys from "@/utils/profile-token/generateProfileTokenKeys"
import setProfileAccessTokenCookie from "@/utils/profile-token/setProfileAccessTokenCookie"
import setProfileRefreshTokenCookie from "@/utils/profile-token/setProfileRefreshTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Add Profile"
const successMessage: string = "Successfully Handled Add Profile"
const failureMessage: string = "Failed to Handle Add Profile"
const serverErrorMessage: string = "Error Handling Add Profile"
const clientErrorMessage: string = "Server Error"
const invalidCredentialsMessage: string = "Username and Password are not Associated"

// Objects
let responseData: AddProfileResponseData
let helperResult: AddProfileHelperResult

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function validateBody(body: AddProfileRawBody): AddProfileHelperResult {
  try {
    logger.attempt("Validating Body")
    const results: ValidationResult[] = []
    let result: ValidationResult
    result = validateUsername(body.username)
    results.push(result)
    result = validatePassword(body.password)
    results.push(result)

    const validationsResult: ValidationsResult = processValidationResults(results)
    if (validationsResult.valid) {
      logger.success("Body is Valid")
      const validBody = body as AddProfileValidBody
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

export default async function handleAddProfile(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = validateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = helperResult.data as AddProfileValidBody

    // Get Device Token
    const deviceToken: string | undefined = getDeviceToken(request)
    if (typeof deviceToken === "undefined") {
      const serverMessage: string = "Device Token is Undefined"
      const clientMessage: string = "Please Try Again"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Successfully Retrieved Device Token")

    // Verify Device Token
    const deviceTokenPayload: DeviceTokenPayload | "expired" | "invalid" = verifyDeviceToken(deviceToken)
    if (deviceTokenPayload === "expired") {
      const serverMessage: string = "Device Token is Expired"
      const clientMessage: string = "Please Refresh the App"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    if (deviceTokenPayload === "invalid") {
      const serverMessage: string = "Device Token is Invalid"
      const clientMessage: string = "Please Refresh the App"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Device Token is Valid")

    // Get Profile By Username
    const profile: Profile | null = await getProfileByUsername(body.username)
    if (profile === null) {
      const serverMessage: string = "Profile Not Found"
      const clientMessage: string = invalidCredentialsMessage
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Successfully Retrieved Profile By Username")

    // Verify Password
    const match: boolean = await verifyPassword(profile.password, body.password)
    if (!match) {
      const serverMessage: string = "Passwords Don't Match"
      const clientMessage: string = invalidCredentialsMessage
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Passwords Match")

    // Check Device Profile
    const existingDeviceProfile: DeviceProfile | null = await getDeviceProfile(deviceTokenPayload.deviceID, profile.id)
    if (existingDeviceProfile !== null) {
      const serverMessage: string = "Profile Found"
      const clientMessage: string = "Profile Already Exists on Your Device"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(400).json(responseData)
    }
    logger.success("Profile Not Found")

    // Register Device Profile
    const deviceProfile: DeviceProfile = await registerDeviceProfile(deviceTokenPayload.deviceID, profile.id)

    // Process Profile Tokens
    const profileTokenPayload: ProfileTokenPayload = {
      deviceID: deviceProfile.deviceID,
      profileID: deviceProfile.profileID,
      version: deviceProfile.version
    }
    const profileTokens: ProfileTokens = generateProfileTokens(profileTokenPayload)
    const profileTokenKeys: ProfileTokenKeys = generateProfileTokenKeys(profileTokenPayload.profileID)
    setProfileAccessTokenCookie(response, profileTokenKeys.profileAccessTokenKey, profileTokens.profileAccessToken)
    setProfileRefreshTokenCookie(response, profileTokenKeys.profileRefreshTokenKey, profileTokens.profileRefreshToken)

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
