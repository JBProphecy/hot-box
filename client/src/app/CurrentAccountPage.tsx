////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef } from "react"
import localStyles from "./CurrentAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CurrentAccountPage() {
  try {
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    const pageRef = useRef<HTMLDivElement>(null)
    const pageDimensions = useDimensions(pageRef)
    useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])
    const variableStyles: VariableStyles = {
      "--pageWidth": toPixelString(pageDimensions.width),
      "--pageHeight": toPixelString(pageDimensions.height)
    }

    if (currentAccount.getID) {
      return (
        <div ref={pageRef} className={localStyles.page} style={variableStyles}>
          <h1>Current Account Page</h1>
          <h2>{currentAccount.getID}</h2>
          <h2>{currentAccount.getName}</h2>
        </div>
      )
    }
    else {
      return (
        <div ref={pageRef} className={localStyles.page} style={variableStyles}>
          <h1>Current Account Page</h1>
          <h2>You are Logged Out</h2>
        </div>
      )
    }
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Current Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
