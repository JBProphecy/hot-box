////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ansi from "@/library/ansi"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function formatStatusCode(code: number): string {
  if (code >= 200 && code < 300) return ansi.styles.bold + ansi.fgc.green + String(code) + ansi.reset
  else if (code >= 300 && code < 400) return ansi.styles.bold + ansi.fgc.yellow + String(code) + ansi.reset
  else if (code >= 400 && code < 500) return ansi.styles.bold + ansi.fgc.orange + String(code) + ansi.reset
  else if (code >= 500 && code < 600) return ansi.styles.bold + ansi.fgc.red + String(code) + ansi.reset
  else return String(code)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
