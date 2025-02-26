////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import localStyles from "./CurrentProfilePage.module.css"
import useDimensions from "@/app/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/app/utils/styles/types/VariableStyles"
import { CurrentProfileContext, CurrentProfileContextType } from "@/app/context/CurrentProfileContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentProfilePage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const pageDimensions = useDimensions(pageRef)
  useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageDimensions.width),
    "--pageHeight": toPixelString(pageDimensions.height)
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
      return <></>
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
