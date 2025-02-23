////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useNavigate, NavigateFunction } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import routes from "@/library/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import RGButton from "@/app/components/RGButton"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {
  const navigate: NavigateFunction = useNavigate()
  const loadDeviceProfilesPage = () => navigate(routes.deviceProfilesPage)

  try {
    // Return Content
    return (
      <div className={styles.page}>
        <div className={styles.container1}>
          <RGButton
            type="text"
            text="Welcome"
            action={loadDeviceProfilesPage}
          />
        </div>
        <div className={styles.container2}>
          <RGButton
            type="icon"
            className="bx bx-windows"
            action={loadDeviceProfilesPage}
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
