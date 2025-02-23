////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateAccountForm.module.css"
import routes from "@/library/routes"

import { CreateAccountRawBody } from "shared/types/api/CreateAccountTypes"
import requestCreateAccount, { CreateAccountResult } from "@/api/requestCreateAccount"

import RGButton from "@/app/components/RGButton"
import FancyInput from "@/app/components/FancyInput"

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
      if (formData.setPassword !== formData.confirmPassword) {
        console.warn("Passwords Don't Match")
        return false
      }
      return true
    }

    // Handle Create Account
    const handleCreateAccount = async () => {
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

    // Return Content
    return (
      <form className={styles.form}>
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
        <div className={styles.buttons}>
          <RGButton
            type="text"
            text="Go Back"
            action={loadCurrentAccountPage}
          />
          <RGButton
            type="text"
            text="Create Account"
            action={handleCreateAccount}
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
