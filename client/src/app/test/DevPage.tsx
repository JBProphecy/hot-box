////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import { FancyButton, FancyButtonStyles } from "../modules/fancy"
import { fancyColors } from "../library/fancyColors"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fancyButtonStyles: FancyButtonStyles = {
  height: 400,
  borderWidth: 8,
  borderRadius: 20
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {

  try {
    // Return Content
    return (
      <div className={styles.page}>
        <FancyButton
          colors={fancyColors.set01}
          styles={fancyButtonStyles}
          type="icon"
          className="bx bx-windows"
          action={() => console.log("hey")}
        />
        <FancyButton
          colors={fancyColors.set02}
          styles={fancyButtonStyles}
          type="icon"
          className="bx bx-windows"
          action={() => console.log("hey")}
        />
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Dev Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
