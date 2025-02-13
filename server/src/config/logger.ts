////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ansi from "@/lib/ansi"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function line() { console.log("=".repeat(120)) }
function space() { console.log() }

function log(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.blue}LOG${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function info(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.blue}INFO${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function error(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.red}ERROR${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function trace(error: Error, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.orange}TRACE${ansi.reset}] =>`,
    `${error.message + ansi.reset}`,
    ...optionalParams
  )
  console.log(error)
}

function attempt(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.blue}ATTEMPT${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function failure(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.red}FAILURE${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function warning(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.yellow}WARNING${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function success(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.green}SUCCESS${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function network(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.purple}NETWORK${ansi.reset}] =>`,
    `${object + ansi.reset}`,
    ...optionalParams
  )
}

function start() {
  line()
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.purple}START OF LOGS${ansi.reset}]`,
  )
  line()
}

function end() {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${ansi.styles.bold + ansi.fgc.purple}END OF LOGS${ansi.reset}]`,
  )
  line()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type LoggerType = {
  line: () => void,
  space: () => void,
  log: (object?: any, ...optionalParams: any[]) => void,
  info: (object?: any, ...optionalParams: any[]) => void,
  error: (object?: any, ...optionalParams: any[]) => void,
  trace: (error: Error, ...optionalParams: any[]) => void,
  attempt: (object?: any, ...optionalParams: any[]) => void,
  failure: (object?: any, ...optionalParams: any[]) => void,
  warning: (object?: any, ...optionalParams: any[]) => void,
  success: (object?: any, ...optionalParams: any[]) => void,
  network: (object?: any, ...optionalParams: any[]) => void,
  start: () => void,
  end: () => void
}

const logger: LoggerType = {
  line, space, log, info, error, trace, attempt, failure, warning, success, network, start, end
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default logger

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
