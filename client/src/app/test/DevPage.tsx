////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useNavigate, NavigateFunction } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./DevPage.module.css"
import routes from "@/library/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import RGButton from "@/app/components/RGButton"

function getRGButtonContent(loadDeviceProfilesPage: Function) {
  return (
    <>
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
  </>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FancyInput, { FancyInputProps } from "@/app/components/FancyInput"
import { useState } from "react"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function DevPage() {
  const navigate: NavigateFunction = useNavigate()
  const loadDeviceProfilesPage = () => navigate(routes.deviceProfilesPage)

  try {
    // Form Data
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      setPassword: "",
      confirmPassword: ""
    })

    // Update Form Data
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setFormData((previousData) => ({
        ...previousData,
        [name]: value
      }))
    }

    // Return Content
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <FancyInput
            height={60}
            label="Name:"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            handleChange={handleInputChange}
          />
          <FancyInput
            height={60}
            label="Email:"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            handleChange={handleInputChange}
          />
          <FancyInput
            height={60}
            label="Set Password:"
            id="set-password"
            type="password"
            name="setPassword"
            value={formData.setPassword}
            placeholder="Set Password"
            handleChange={handleInputChange}
          />
          <FancyInput
            height={60}
            label="Confirm Password:"
            id="confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            handleChange={handleInputChange}
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
