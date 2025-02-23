////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateAccountForm.module.css"
import routes from "@/library/routes"

import { CreateAccountRawBody } from "shared/types/api/CreateAccountTypes"
import requestCreateAccount, { CreateAccountResult } from "@/api/requestCreateAccount"

import useKeyable from "@/hooks/useKeyable"
import useClickable from "@/hooks/useClickable"

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

    // Refs
    const goBackButtonRef = useRef<HTMLInputElement>(null)
    const createAccountButtonRef = useRef<HTMLInputElement>(null)

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

    // Keyable
    const { handleKeyDown: handleKeyDownBackButton, handleKeyUp: handleKeyUpBackButton } = useKeyable({
      element: goBackButtonRef,
      activeClass: styles.active,
      key: "Enter",
      action: loadCurrentAccountPage
    })
    const { handleKeyDown: handleKeyDownSubmitButton, handleKeyUp: handleKeyUpSubmitButton } = useKeyable({
      element: createAccountButtonRef,
      activeClass: styles.active,
      key: "Enter",
      action: handleCreateAccount
    })

    // Clickable
    const { handleMouseDown: handleMouseDownBackButton, handleMouseUp: handleMouseUpBackButton } = useClickable({
      element: goBackButtonRef,
      activeClass: styles.active,
      action: loadCurrentAccountPage
    })
    const { handleMouseDown: handleMouseDownSubmitButton, handleMouseUp: handleMouseUpSubmitButton } = useClickable({
      element: createAccountButtonRef,
      activeClass: styles.active,
      action: handleCreateAccount
    })


    // Return Content
    return (
      <form className={styles.form}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email"
            required
          />
        </div>
        <div>
          <label htmlFor="set-password">Set Password:</label>
          <input
            id="set-password"
            type="password"
            name="setPassword"
            value={formData.setPassword}
            onChange={handleInputChange}
            placeholder="set password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            id="confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="confirm password"
            required
          />
        </div>
        <div>
          <input
            ref={goBackButtonRef}
            type="button"
            value="Go Back"
            onKeyDown={handleKeyDownBackButton}
            onKeyUp={handleKeyUpBackButton}
            onMouseDown={handleMouseDownBackButton}
            onMouseUp={handleMouseUpBackButton}
          />
          <input
            ref={createAccountButtonRef}
            type="button"
            value="Create Account"
            onKeyDown={handleKeyDownSubmitButton}
            onKeyUp={handleKeyUpSubmitButton}
            onMouseDown={handleMouseDownSubmitButton}
            onMouseUp={handleMouseUpSubmitButton}
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
