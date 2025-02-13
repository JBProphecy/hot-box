////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const reset: string = "\x1b[0m"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type StylesType = {
  bold: string,
  faint: string,
  italic: string,
  underline: string,
  //slowBlink: string,
  //fastBlink: string,
  reverse: string,
  hidden: string,
  strikethrough: string
}

// Styles
const styles: StylesType = {
  bold: "\x1b[1m",
  faint: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  //slowBlink: "\x1b[5m",
  //fastBlink: "\x1b[6m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  strikethrough: "\x1b[9m",
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ColorsType = {
  red: string,
  orange: string,
  yellow: string,
  green: string,
  blue: string,
  purple: string
}

// Colors
const colors: ColorsType = {
  red: "255;80;80m",
  orange: "255;165;80m",
  yellow: "255;232;80m",
  green: "80;248;80m",
  blue: "80;216;255m",
  purple: "255;80;255m"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const foreground: string = "38;2;"

type FGCType = {
  red: string,
  orange: string,
  yellow: string,
  green: string,
  blue: string,
  purple: string
}

// Foreground Colors
const fgc: FGCType = {
  red: `\x1b[${foreground + colors.red}`,
  orange: `\x1b[${foreground + colors.orange}`,
  yellow: `\x1b[${foreground + colors.yellow}`,
  green: `\x1b[${foreground + colors.green}`,
  blue: `\x1b[${foreground + colors.blue}`,
  purple: `\x1b[${foreground + colors.purple}`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const background: string = "48;2;"

type BGCType = {
  red: string,
  orange: string,
  yellow: string,
  green: string,
  blue: string,
  purple: string
}

// Background Colors
const bgc: BGCType = {
  red: `\x1b[${background + colors.red}`,
  orange: `\x1b[${background + colors.orange}`,
  yellow: `\x1b[${background + colors.yellow}`,
  green: `\x1b[${background + colors.green}`,
  blue: `\x1b[${background + colors.blue}`,
  purple: `\x1b[${background + colors.purple}`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ANSIType = {
  reset: string,
  styles: StylesType,
  fgc: FGCType,
  bgc: BGCType
}

const ansi: ANSIType = { reset, styles, fgc, bgc }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default ansi

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
