////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import { FancyButton, FancyButtonStyles } from "../modules/fancy"
import { fancyColors } from "../library/fancyColors"
import { VariableStyles } from "@/utils/styles"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {
  try {
    // Dynamic Values
    const itemWidth: string = "8rem"
    const itemHeight: string = "8rem"

    // Variable Styles
    const variables: VariableStyles = {
      "--itemWidth": itemWidth
    }

    // Fancy Button Styles
    const fancyButtonStyles: FancyButtonStyles = {
      width: itemWidth,
      height: itemHeight,
    }

    // Return Content
    return (
      <div className={styles.page} style={variables}>
        <div className={styles.grid}>
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="text"
            text="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-cog"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bx-windows"
            action={() => console.log("hey")}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="icon"
            icon="bx bxs-user"
            action={() => console.log("hey")}
          />
        </div>
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
