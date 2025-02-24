////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateAccountForm.module.css"
import routes from "@/library/routes"

import { CreateAccountRawBody } from "shared/types/api/CreateAccountTypes"
import requestCreateAccount, { CreateAccountResult } from "@/api/requestCreateAccount"

import { FancyInput, FancyInputStyles, FancyButton, FancyButtonStyles } from "@/app/modules/fancy"
import { fancyColors } from "@/app/library/fancyColors"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CreateAccountFormData = {
  name: string
  email: string
  setPassword: string
  confirmPassword: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateAccountForm() {
  try {
    // Form Ref
    const formRef = useRef<HTMLFormElement>(null)

    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadCurrentAccountPage = () => { navigate(routes.currentAccountPage) }

    // Form Data
    const [formData, setFormData] = useState<CreateAccountFormData>({
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

    // Validate Form Data
    const validateFormData = () => {
      if (!formData.name) {
        console.warn("Name is Required")
        return false
      }
      if (!formData.email) {
        console.warn("Email is Required")
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

    // Handle Create Account
    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const isValidFormData: boolean = validateFormData()
      if (!isValidFormData) {
        console.warn("Form Data is Invalid")
        return
      }
      const body: CreateAccountRawBody = {
        name: formData.name,
        email: formData.email,
        password: formData.setPassword
      }
      const result: CreateAccountResult = await requestCreateAccount(body)
      if (!result.success) { return }
      navigate(routes.currentAccountPage)
    }

    // Fancy Input Styles
    const fancyInputStyles: FancyInputStyles = {
      flexDirection: "row"
    }

    // Fancy Button Styles
    const fancyButtonStyles: FancyButtonStyles = {}

    // Return Content
    return (
      <form ref={formRef} onSubmit={handleCreateAccount} className={styles.form}>
        <FancyInput
          colors={fancyColors.set01}
          styles={fancyInputStyles}
          label="Name:"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          handleChange={handleInputChange}
        />
        <FancyInput
          colors={fancyColors.set01}
          styles={fancyInputStyles}
          label="Email:"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          handleChange={handleInputChange}
        />
        <FancyInput
          colors={fancyColors.set01}
          styles={fancyInputStyles}
          label="Set Password:"
          id="set-password"
          type="password"
          name="setPassword"
          value={formData.setPassword}
          placeholder="Set Password"
          handleChange={handleInputChange}
        />
        <FancyInput
          colors={fancyColors.set01}
          styles={fancyInputStyles}
          label="Confirm Password:"
          id="confirm-password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm Password"
          handleChange={handleInputChange}
        />
        <div className={styles.buttons}>
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="text"
            text="Go Back"
            action={loadCurrentAccountPage}
          />
          <FancyButton
            colors={fancyColors.set02}
            styles={fancyButtonStyles}
            type="text"
            text="Create Account"
            action={() => formRef.current?.requestSubmit()}
          />
        </div>
      </form>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Create Account Form")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
