////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Environment = Record<string, string | number>

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const processString = (variables: Environment, name: string): string => {
  try {
    let value: string | number | undefined = variables[name]
    if (typeof value === "undefined") { throw new Error(`${name} is undefined`) }
    if (typeof value !== "string") { throw new Error(`${name} is not a string`) }
    return value
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Processing String")
    console.log(error)
    throw error
  }
}

export const processNumber = (variables: Environment, name: string): number => {
  try {
    let value: string | number | undefined = variables[name]
    if (typeof value === "undefined") { throw new Error(`${name} is undefined`) }
    if (typeof value !== "number") { throw new Error(`${name} is not a number`) }
    return value
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Processing Number")
    console.log(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
