////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ansi from "@/lib/ansi"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateTimestamp() {
  return `[${new Date().toLocaleString()}]`
}

function generateLabel(text: string, color?: string) {
  color = color ?? ""
  return `[${ansi.styles.bold + color + text + ansi.reset}]`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function line() { console.log("=".repeat(120)) }
function space() { console.log() }

function record(color: string, label: string, object?: any, ...optionalParams: any[]) {
  console.log(
    generateTimestamp(),
    generateLabel(label, color),
    object, ...optionalParams
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function start() {
  line()
  console.log(
    generateTimestamp(),
    generateLabel("START OF LOGS", ansi.fgc.purple)
  )
  line()
}

function end() {
  console.log(
    generateTimestamp(),
    generateLabel("END OF LOGS", ansi.fgc.purple)
  )
  line()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function error(error?: Error, ...optionalParams: any[]) {
  const message: string | undefined = error instanceof Error ? `${error.name}: ${error.message}` : undefined
  record(ansi.fgc.red, "ERROR", message, ...optionalParams)
}

function trace(error?: Error, ...optionalParams: any[]) {
  error = error instanceof Error ? error : undefined
  record(ansi.fgc.orange, "TRACE", error, ...optionalParams)
}

function attempt(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.blue, "ATTEMPT", object, ...optionalParams)
}

function message(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.blue, "MESSAGE", object, ...optionalParams)
}

function network(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.purple, "NETWORK", object, ...optionalParams)
}

function failure(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.red, "FAILURE", object, ...optionalParams)
}

function warning(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.yellow, "WARNING", object, ...optionalParams)
}

function success(object?: any, ...optionalParams: any[]) {
  record(ansi.fgc.green, "SUCCESS", object, ...optionalParams)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const logger = {
  line, space,
  error, trace,
  message,
  attempt, network,
  failure, warning, success,
  start, end
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default logger

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
