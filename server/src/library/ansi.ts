////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const reset: string = "\x1b[0m"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type StylesType = {
  bold: string
  faint: string
  italic: string
  underline: string
  //slowBlink: string
  //fastBlink: string
  reverse: string
  hidden: string
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
  red: string
  orange: string
  yellow: string
  green: string
  blue: string
  purple: string
  teal: string
}

// Colors
const colors: ColorsType = {
  red: "255;80;80m",
  orange: "255;165;80m",
  yellow: "255;232;80m",
  green: "80;232;80m",
  blue: "80;200;255m",
  purple: "232;80;255m",
  teal: "80;255;200m"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Foreground
const fg: string = "38;2;"

// Foreground Colors
const fgc: ColorsType = {
  red: `\x1b[${fg + colors.red}`,
  orange: `\x1b[${fg + colors.orange}`,
  yellow: `\x1b[${fg + colors.yellow}`,
  green: `\x1b[${fg + colors.green}`,
  blue: `\x1b[${fg + colors.blue}`,
  purple: `\x1b[${fg + colors.purple}`,
  teal: `\x1b[${fg + colors.teal}`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Background
const bg: string = "48;2;"

// Background Colors
const bgc: ColorsType = {
  red: `\x1b[${bg + colors.red}`,
  orange: `\x1b[${bg + colors.orange}`,
  yellow: `\x1b[${bg + colors.yellow}`,
  green: `\x1b[${bg + colors.green}`,
  blue: `\x1b[${bg + colors.blue}`,
  purple: `\x1b[${bg + colors.purple}`,
  teal: `\x1b[${bg + colors.teal}`
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ANSIType = {
  reset: string,
  styles: StylesType,
  fgc: ColorsType,
  bgc: ColorsType
}

const ansi: ANSIType = { reset, styles, fgc, bgc }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default ansi

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
