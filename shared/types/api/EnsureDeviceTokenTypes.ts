////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type EnsureDeviceTokenResponseData = {
  type: "success"
} | {
  type: "failure" | "error"
  message: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
