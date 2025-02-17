////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type UnknownResult = {
  status: number
  data: unknown
}

export function isResult(object: unknown) {
  if (typeof object !== "object" || object === null) { return false }
  if (!("status" in object)) { return false }
  if (typeof object.status !== "number") { return false }
  return true
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Helper = {
  respond: true
  result: UnknownResult
} | {
  respond: false
  result?: unknown
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
