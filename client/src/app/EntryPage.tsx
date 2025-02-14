////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./EntryPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { VariableStyles, toPixelString } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function EntryPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  return (
    <div ref={pageRef} className={localStyles.page} style={variableStyles}>
      <div className={localStyles.profileMenu}>
        <ul className={localStyles.profileList}>
          <li className={localStyles.profileItem}></li>
          <li className={localStyles.profileItem}></li>
          <li className={localStyles.profileItem}></li>
          <li className={localStyles.profileItem}></li>
          <li className={localStyles.profileItem}></li>
        </ul>
        <div className={localStyles.profileButtons}>
          <div className={localStyles.removeAllProfilesButton}></div>
          <div className={localStyles.addProfileButton}></div>
        </div>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
