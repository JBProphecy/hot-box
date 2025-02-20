////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"

import { Request, Response } from "express"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"
import {
  SignInProfileRawBody, SignInProfileValidBody,
  SignInProfileResponseData, SignInProfileHelperResult
} from "shared/api/SignInProfileTypes"

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"

import { Profile } from "@prisma/client"
import getProfileByUsername from "@/database/private/getProfileByUsername"
import verifyPassword from "@/utils/verifyPassword"

import { DeviceProfile } from "@prisma/client"
import getDeviceProfile from "@/database/private/getDeviceProfile"

import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"
import ProfileTokens from "@/types/profile-token/ProfileTokens"
import generateProfileTokens from "@/utils/profile-token/generateProfileTokens"
import ProfileTokenKeys from "@/types/profile-token/ProfileTokenKeys"
import generateProfileTokenKeys from "@/utils/profile-token/generateProfileTokenKeys"
import setProfileAccessTokenCookie from "@/utils/profile-token/setProfileAccessTokenCookie"
import setProfileRefreshTokenCookie from "@/utils/profile-token/setProfileRefreshTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Messages
const attemptMessage: string = "Handling Sign In Profile"
const successMessage: string = "Success Handling Sign In Profile"
const failureMessage: string = "Failure Handling Sign In Profile"
const errorMessage: string = "Error Handling Sign In Profile"
const invalidCredentialsMessage: string = "Username and Password are not Associated"

// Objects
let responseData: SignInProfileResponseData
let helperResult: SignInProfileHelperResult

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

function validateBody(body: SignInProfileRawBody): SignInProfileHelperResult {
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
      const validBody: SignInProfileValidBody = body as SignInProfileValidBody
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

export default async function handleSignInProfile(request: Request, response: Response) {
  try {
    logger.attempt(attemptMessage)

    // Validate Body
    helperResult = validateBody(request.body)
    if (helperResult.respond) { return response.status(helperResult.status).json(helperResult.data) }
    const body = helperResult.data as SignInProfileValidBody

    // Get Device Token
    logger.attempt("Getting Device Token")
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
    logger.attempt("Verifying Device Token")
    const deviceTokenPayload: DeviceTokenPayload | "expired" | "invalid" = verifyDeviceToken(deviceToken)
    if (deviceTokenPayload === "expired") {
      const serverMessage: string = "Device Token is Expired"
      const clientMessage: string = "Please Try Again"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    if (deviceTokenPayload === "invalid") {
      const serverMessage: string = "Device Token is Invalid"
      const clientMessage: string = "Please Try Again"
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

    // Get Device Profile
    const deviceProfile: DeviceProfile | null = await getDeviceProfile(deviceTokenPayload.deviceID, profile.id)
    if (deviceProfile === null) {
      const serverMessage: string = "Device Profile is Null"
      const clientMessage: string = "Profile Doesn't Exist on Your Device"
      logger.warning(serverMessage)
      logger.failure(failureMessage)
      responseData = { type: "failure", message: clientMessage }
      return response.status(403).json(responseData)
    }
    logger.success("Successfully Retrieved Profile")

    // Generate Profile Tokens
    const profileTokenPayload: ProfileTokenPayload = {
      deviceID: deviceProfile.deviceID,
      profileID: deviceProfile.profileID,
      version: deviceProfile.version
    }
    const profileTokens: ProfileTokens = generateProfileTokens(profileTokenPayload)
    const profileTokenKeys: ProfileTokenKeys = generateProfileTokenKeys(profileTokenPayload.profileID)

    // Set Profile Token Cookies
    setProfileAccessTokenCookie(response, profileTokenKeys.profileAccessTokenKey, profileTokens.profileAccessToken)
    setProfileRefreshTokenCookie(response, profileTokenKeys.profileRefreshTokenKey, profileTokens.profileRefreshToken)

    // Return Successful Response
    logger.success(successMessage)
    responseData = { type: "success", profileID: profileTokenPayload.profileID }
    return response.status(200).json(responseData)
  }
  catch (object: unknown) {
    const error = object as Error
    logger.failure(errorMessage)
    logger.error(error)
    logger.trace(error)
    responseData = { type: "error", message: "Server Error" }
    return response.status(500).json(responseData)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
