////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./SignInProfileForm.module.css"
import routes from "@/config/routes"

import { SignInProfileRawBody } from "shared/types/api/SignInProfileTypes"
import requestSignInProfile, { SignInProfileResult } from "@/api/requestSignInProfile"

import { CurrentProfileContext, CurrentProfileContextType } from "../context/CurrentProfileContext"

import FancyInput, { FancyInputProps } from "../components/FancyInput"
import FancyButton, { FancyButtonSizeProps } from "../components/FancyButton"
import threeColorSets from "@/app/library/threeColorSets"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SignInProfileFormData = {
  username: string
  password: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInProfileForm() {
  // Form Ref
  const formRef = useRef<HTMLFormElement>(null)

  // Form Data
  const [formData, setFormData] = useState<SignInProfileFormData>({
    username: "",
    password: "",
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

  // Current Account
  const currentProfile: CurrentProfileContextType | undefined = useContext(CurrentProfileContext)
  if (typeof currentProfile === "undefined") { throw new Error("Missing Current Profile Provider") }

  // Navigation
  const navigate: NavigateFunction = useNavigate()

  // Go Back
  const loadDeviceProfilesPage = () => { navigate(routes.deviceProfilesPage) }

  // Handle Submission
  const handleSignInProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValidFormData: boolean = validateFormData()
    if (!isValidFormData) {
      console.warn("Form Data is Invalid")
      return
    }
    const body: SignInProfileRawBody = {
      username: formData.username,
      password: formData.password
    }
    const result: SignInProfileResult = await requestSignInProfile(body)
    if (!result.success) { return }
    currentProfile.setID(result.profileID)
    navigate(routes.currentProfilePage)
  }

  // Shared Fancy Input Props
  const sharedFancyInputProps: FancyInputProps = {
    handleChange: handleInputChange,
    colors: threeColorSets.set03,
    styles: {
      flexDirection: "row"
    }
  }

  // Shared Fancy Button Styles
  const fancyButtonSizeProps: FancyButtonSizeProps = {
    width: { type: "intrinsic" },
    height: { type: "absolute", value: 5, units: "rem" }
  }

  // Return Content
  return (
    <form ref={formRef} onSubmit={handleSignInProfile} className={styles.form}>
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
          contentValue="Sign In"
          pressedAction={() => formRef.current?.requestSubmit()}
          activeColors={threeColorSets.set03}
        />
      </div>
    </form>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
