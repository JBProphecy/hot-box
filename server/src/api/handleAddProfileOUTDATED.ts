////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Request, Response } from "express"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import logger from "@/library/logger"
import { Profile } from "@prisma/client"
import { DeviceProfile } from "@prisma/client"
import getProfileByUsername from "@/database/getProfileByUsername"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import verifyPassword from "@/utils/verifyPassword"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Database
import getDeviceProfile from "@/database/private/getDeviceProfile"
import registerDeviceProfile from "@/database/registerDeviceProfile"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import getDeviceToken from "@/utils/device-token/getDeviceToken"
import verifyDeviceToken from "@/utils/device-token/verifyDeviceToken"
import DeviceTokenPayload from "@/types/device-token/DeviceTokenPayload"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ProfileTokenPayload from "@/types/profile-token/ProfileTokenPayload"

import ProfileTokens from "@/types/profile-token/ProfileTokens"
import generateProfileTokens from "@/utils/profile-token/generateProfileTokens"

import ProfileTokenKeys from "@/types/profile-token/ProfileTokenKeys"
import generateProfileTokenKeys from "@/utils/profile-token/generateProfileTokenKeys"

import setProfileAccessTokenCookie from "@/utils/profile-token/setProfileAccessTokenCookie"
import setProfileRefreshTokenCookie from "@/utils/profile-token/setProfileRefreshTokenCookie"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Helper, isResult } from "@/library/network"
import { AddProfileRequestBody, AddProfileValidBody, AddProfileResponseData, AddProfileResult } from "shared/types/AddProfileTypes"
import { ValidationResult, ValidationsResult, processValidationResults } from "@/library/validation"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateUsername(username: string | undefined): ValidationResult {
  logger.attempt("Validating Username")
  if (!username || username.trim() === "") {
    const warning: string = "Username is Required"
    logger.warning(warning)
    logger.failure("Username is Invalid")
    return { success: false, message: warning }
  }
  else {
    logger.success("Username is Valid")
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

function getValidationResults(body: AddProfileRequestBody): ValidationResult[] {
  const results: ValidationResult[] = []
  let result: ValidationResult
  result = validateUsername(body.username)
  results.push(result)
  result = validatePassword(body.password)
  results.push(result)
  return results
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateBody(body: AddProfileRequestBody): Helper {
  logger.attempt("Validating Body")

  const results: ValidationResult[] = getValidationResults(body)
  const vResult: ValidationsResult = processValidationResults(results)

  if (vResult.valid) {
    logger.success("Body is Valid")
    const validBody = body as AddProfileValidBody
    return { respond: false, result: validBody }
  }
  else {
    logger.failure("Body is Invalid")
    const data: AddProfileResponseData = { type: "invalid body", messages: vResult.messages }
    const result: AddProfileResult = { status: 400, data: data }
    return { respond: true, result: result }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function handleAddProfile(request: Request, response: Response) {
  // Helper Objects
  let data: AddProfileResponseData
  let result: AddProfileResult
  let helper: Helper

  // Security Purposes
  const invalidCredentialsMessage: string = "Invalid Credentials"

  try {
    // Initial Message
    logger.attempt("Adding Profile to Your Device")

    // Validate Body
    helper = validateBody(request.body)
    if (helper.respond) { throw helper.result }
    const body = helper.result as AddProfileValidBody

    // Fetch Profile
    logger.attempt("Fetching Profile")
    const profile: Profile | null = await getProfileByUsername(body.username)
    if (profile === null) {
      logger.failure("Profile Doesn't Exist")
      data = { type: "failure", message: invalidCredentialsMessage }
      result = { status: 400, data: data }
      throw result
    }
    logger.success("Successfully Fetched Profile")

    // Verify Password
    logger.attempt("Verifying Password")
    const match: boolean = await verifyPassword(profile.password, body.password)
    if (!match) {
      logger.failure("Password is Invalid")
      data = { type: "failure", message: invalidCredentialsMessage }
      result = { status: 400, data: data }
      throw result
    }
    logger.success("Password is Valid")

    // Get Device Token
    logger.attempt("Fetching Device Token")
    const deviceToken: string | undefined = getDeviceToken(request)
    if (typeof deviceToken === "undefined") {
      const message: string = "Missing Device Token"
      logger.failure(message)
      data = { type: "failure", message: message }
      result = { status: 400, data: data }
      throw result
    }
    logger.success("Retrieved Device Token")

    // Verify Device Token
    logger.attempt("Verifying Device Token")
    const deviceTokenPayload: DeviceTokenPayload | "expired" | "invalid" = verifyDeviceToken(deviceToken)
    if (deviceTokenPayload === "expired") {
      const message: string = "Device Token is Expired"
      logger.warning(message)
      data = { type: "failure", message: message }
      result = { status: 403, data: data }
      throw result
    }
    if (deviceTokenPayload === "invalid") {
      const message: string = "Device Token is Invalid"
      logger.warning(message)
      data = { type: "failure", message: message }
      result = { status: 403, data: data }
      throw result
    }
    logger.success("Device Token is Valid")

    // Check Device Profile
    logger.attempt("Checking Device Profile")
    const existingDeviceProfile: DeviceProfile | null = await getDeviceProfile(deviceTokenPayload.deviceID, profile.id)
    if (existingDeviceProfile !== null) {
      const message: string = "Profile Already Exists on Your Device"
      logger.warning(message)
      data = { type: "failure", message: message }
      result = { status: 400, data: data}
      throw result
    }
    logger.success("Profile Doesn't Exist on Your Device")

    // Register Device Profile
    const deviceProfile: DeviceProfile = await registerDeviceProfile(deviceTokenPayload.deviceID, profile.id)

    // SHOULD I OR SHOULD I NOT GENERATE PROFILE TOKENS HERE?
    // IF PROFILE ALREADY EXISTS, TOKENS WON'T BE GENERATED FOR THE WAY I HAVE IT SET UP NOW

    // Generate Profile Tokens
    const profileTokenPayload: ProfileTokenPayload = {
      deviceID: deviceProfile.deviceID,
      profileID: deviceProfile.profileID,
      version: deviceProfile.version
    }
    const profileTokens: ProfileTokens = generateProfileTokens(profileTokenPayload)
    const { profileAccessToken, profileRefreshToken } = profileTokens
    const profileTokenKeys: ProfileTokenKeys = generateProfileTokenKeys(profileTokenPayload.profileID)
    const { profileAccessTokenKey, profileRefreshTokenKey } = profileTokenKeys

    // Set Profile Token Cookies
    setProfileAccessTokenCookie(response, profileAccessTokenKey, profileAccessToken)
    setProfileRefreshTokenCookie(response, profileRefreshTokenKey, profileRefreshToken)

    // Return Success
    const success: string = "Successfully Added Profile to Your Device"
    logger.success(success)
    data = { type: "success", message: success }
    result = { status: 201, data: data }
    return response.status(result.status).json(result)
  }
  catch (object: unknown) {
    if (isResult(object)) {
      result = object as AddProfileResult
      logger.failure("Failed to Add Profile to Your Device")
      return response.status(result.status).json(result)
    }
    logger.failure("Error Adding Profile to Your Device")
    const error = object as Error
    logger.error(error)
    logger.trace(error)
    data = { type: "error", message: "Server Error" }
    result = { status: 500, data: data }
    return response.status(result.status).json(result)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
