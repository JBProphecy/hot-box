////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateProfileForm.module.css"
import routes from "@/config/routes"

import { CreateProfileRawBody } from "shared/types/api/CreateProfileTypes"
import requestCreateProfile, { CreateProfileResult } from "@/api/requestCreateProfile"

import FancyInput, { FancyInputProps } from "@/app/components/FancyInput"
import threeColorSets from "@/app/library/threeColorSets"

import FancyButton, { FancyButtonSizeProps } from "../components/FancyButton"
import { CurrentAccountContext, CurrentAccountContextType } from "../context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CreateProfileFormData = {
  name: string
  username: string
  setPassword: string
  confirmPassword: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateProfileForm() {
  try {
    // Form Ref
    const formRef = useRef<HTMLFormElement>(null)

    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadCurrentAccountPage = () => { navigate(routes.currentAccountPage) }

    // Form Data
    const [formData, setFormData] = useState<CreateProfileFormData>({
      name: "",
      username: "",
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

    // Validate Form Data
    const validateFormData = () => {
      if (!formData.name) {
        console.warn("Name is Required")
        return false
      }
      if (!formData.username) {
        console.warn("Username is Required")
        return false
      }
      if (!formData.setPassword) {
        console.warn("Set Password is Required")
        return false
      }
      if (!formData.confirmPassword) {
        console.warn("Confirm Password is Required")
        return false
      }
      if (formData.setPassword !== formData.confirmPassword) {
        console.warn("Passwords Don't Match")
        return false
      }
      return true
    }

    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Handle Create Profile
    const handleCreateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const isValidFormData: boolean = validateFormData()
      if (!isValidFormData) {
        console.warn("Form Data is Invalid")
        return
      }
      const body: CreateProfileRawBody = {
        name: formData.name,
        username: formData.username,
        password: formData.setPassword
      }
      if (!currentAccount.getID) {
        console.warn("Missing Account ID")
        return
      }
      const result: CreateProfileResult = await requestCreateProfile(currentAccount.getID, body)
      if (!result.success) { return }
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

    // Shared Text Button Styles
    const fancyButtonSizeProps: FancyButtonSizeProps = {
      width: { type: "intrinsic" },
      height: { type: "absolute", value: 5, units: "rem" }
    }

    // Return Content
    return (
      <form ref={formRef} onSubmit={handleCreateProfile} className={styles.form}>
        <FancyInput
          {...sharedFancyInputProps}
          label="Name:"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
        />
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
          label="Set Password:"
          id="set-password"
          type="password"
          name="setPassword"
          value={formData.setPassword}
          placeholder="Set Password"
        />
        <FancyInput
          {...sharedFancyInputProps}
          label="Confirm Password:"
          id="confirm-password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm Password"
        />
        <div className={styles.buttons}>
          <FancyButton
            {...fancyButtonSizeProps}
            contentType="text"
            contentValue="Go Back"
            pressedAction={loadCurrentAccountPage}
            activeColors={threeColorSets.set01}
          />
          <FancyButton
            {...fancyButtonSizeProps}
            contentType="text"
            contentValue="Create Profile"
            pressedAction={() => formRef.current?.requestSubmit()}
            activeColors={threeColorSets.set03}
          />
        </div>
      </form>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Create Profile Form")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
