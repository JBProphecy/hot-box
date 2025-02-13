////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import clientConfig from "@/config/env"
import localStyles from "./DevPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const handleClick = async () => {
  const response: Response = await fetch(`${clientConfig.API_URL}/hello`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const result = await response.json()
  if (response.status >= 200 && response.status < 300) { console.log(result.message) }
  else if (response.status >= 400 && response.status < 500) { console.warn(result.message) }
  else if (response.status >= 500 && response.status < 600) { throw new Error(result.message) }
  else throw new Error("Unhandled Response")
  return result
}

export default function DevPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  return (
    <div ref={pageRef} className={localStyles.page} style={variableStyles}>
      <input type="button" value="hello API" onClick={handleClick} />
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
