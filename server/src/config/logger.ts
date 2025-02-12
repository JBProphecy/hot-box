////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Styles
const styles = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  faint: "\x1b[2m", // not widely supported
  italic: "\x1b[3m", // not supported in all terminals
  underline: "\x1b[4m",
  //slowBlink: "\x1b[5m", // rarely supported
  //fastBlink: "\x1b[6m", // rarely supported
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  strikethrough: "\x1b[9m",
}

// Colors
const colors = {
  red: "232;80;80m",
  yellow: "255;216;80m",
  green: "80;216;80m",
  blue: "80;216;255m",
  purple: "255;100;255m"
}

// Foreground Colors
const fgc = {
  red: `\x1b[38;2;${colors.red}`,
  yellow: `\x1b[38;2;${colors.yellow}`,
  green: `\x1b[38;2;${colors.green}`,
  blue: `\x1b[38;2;${colors.blue}`,
  purple: `\x1b[38;2;${colors.purple}`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Logger Functions

function line() { console.log("=".repeat(100)) }
function space() { console.log() }

function log(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.blue}LOG${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function info(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.blue}INFO${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function error(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.red}ERROR${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function trace(error: Error, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.blue}TRACE${styles.reset}] =>`,
    `${error + styles.reset}`,
    ...optionalParams
  )
  console.log(error.stack)
}

function failure(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.red}FAILURE${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function warning(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.yellow}WARNING${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function success(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.green}SUCCESS${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function network(object?: any, ...optionalParams: any[]) {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.purple}NETWORK${styles.reset}] =>`,
    `${object + styles.reset}`,
    ...optionalParams
  )
}

function start() {
  line()
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.purple}START OF LOGS${styles.reset}]`,
  )
  line()
}

function end() {
  console.log(
    `[${new Date().toLocaleString()}]`,
    `[${styles.bold + fgc.purple}END OF LOGS${styles.reset}]`,
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
  failure: (object?: any, ...optionalParams: any[]) => void,
  warning: (object?: any, ...optionalParams: any[]) => void,
  success: (object?: any, ...optionalParams: any[]) => void,
  network: (object?: any, ...optionalParams: any[]) => void,
  start: () => void,
  end: () => void
}

const logger: LoggerType = { line, space, log, info, error, trace, failure, warning, success, network, start, end }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default logger

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
