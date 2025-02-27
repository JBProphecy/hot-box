////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./AddProfileForm.module.css"
import routes from "@/config/routes"

import { AddProfileRawBody } from "shared/types/api/AddProfileTypes"
import requestAddProfile, { AddProfileResult } from "@/api/requestAddProfile"

import FancyInput, { FancyInputProps } from "@/app/components/FancyInput"
import threeColorSets from "@/app/library/threeColorSets"

import FancyButton, { FancyButtonSizeProps } from "../components/FancyButton"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type AddProfileFormData = {
  username: string
  password: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function AddProfileForm() {
  try {
    // Form Ref
    const formRef = useRef<HTMLFormElement>(null)

    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadDeviceProfilesPage = () => { navigate(routes.deviceProfilesPage) }

    // Form Data
    const [formData, setFormData] = useState<AddProfileFormData>({
      username: "",
      password: ""
    })

    // Update Form Data
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setFormData((previousData) => ({
        ...previousData,
        [name]: value
      }))
    }

    // Validate Form Data
    const validateFormData = () => {
      if (!formData.username) {
        console.warn("Username is Required")
        return false
      }
      if (!formData.password) {
        console.warn("Password is Required")
        return false
      }
      return true
    }

    // Handle Create Profile
    const handleAddProfile = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const isValidFormData: boolean = validateFormData()
      if (!isValidFormData) {
        console.warn("Form Data is Invalid")
        return
      }
      const body: AddProfileRawBody = {
        username: formData.username,
        password: formData.password
      }
      const result: AddProfileResult = await requestAddProfile(body)
      if (!result.success) { return }
      loadDeviceProfilesPage()
    }

    // Shared Fancy Input Props
    const sharedFancyInputProps: FancyInputProps = {
      handleChange: handleInputChange,
      colors: threeColorSets.set03,
      styles: {
        flexDirection: "row"
      }
    }

    // Shared Text Button Styles
    const fancyButtonSizeProps: FancyButtonSizeProps = {
      width: { type: "intrinsic" },
      height: { type: "absolute", value: 5, units: "rem" }
    }

    // Return Content
    return (
      <form ref={formRef} onSubmit={handleAddProfile} className={styles.form}>
        <FancyInput
          {...sharedFancyInputProps}
          label="Username:"
          id="username"
          type="username"
          name="username"
          value={formData.username}
          placeholder="Username"
        />
        <FancyInput
          {...sharedFancyInputProps}
          label="Password:"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
        />
        <div className={styles.buttons}>
          <FancyButton
            {...fancyButtonSizeProps}
            contentType="text"
            contentValue="Back to Profiles"
            pressedAction={loadDeviceProfilesPage}
            activeColors={threeColorSets.set01}
          />
          <FancyButton
            {...fancyButtonSizeProps}
            contentType="text"
            contentValue="Add Profile"
            pressedAction={() => formRef.current?.requestSubmit()}
            activeColors={threeColorSets.set03}
          />
        </div>
      </form>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Add Profile Form")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
