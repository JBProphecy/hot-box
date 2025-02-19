////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef } from "react"
import localStyles from "./CurrentProfilePage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CurrentProfileContext, CurrentProfileContextType } from "@/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentProfilePage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  try {
    const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
    if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

    if (currentProfile.getID) {
      return (
        <div ref={pageRef} className={localStyles.page} style={variableStyles}>
          <h1>Current Profile Page</h1>
          <h2>{currentProfile.getName}</h2>
          <h2>{currentProfile.getUsername}</h2>
        </div>
      )
    }
    else {
      return (
        <div ref={pageRef} className={localStyles.page} style={variableStyles}>
          <h1>Current Profile Page</h1>
          <h2>You are Logged Out</h2>
        </div>
      )
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Profile Page")
    console.error(error)
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <h2>Error Loading Current Profile Page</h2>
      </div>
    )
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
