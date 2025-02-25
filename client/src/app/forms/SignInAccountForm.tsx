////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateAccountForm.module.css"
import routes from "@/library/routes"

import { SignInAccountRawBody } from "shared/types/api/SignInAccountTypes"
import requestSignInAccount, { SignInAccountResult } from "@/api/requestSignInAccount"

import { FancyButton, FancyButtonStyles, FancyColorSet, FancyInput, FancyInputStyles } from "@/app/modules/fancy"
import { fancyColors } from "@/app/library/fancyColors"

import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SignInAccountFormData = {
  email: string
  password: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateAccountForm() {
  try {
    // Form Ref
    const formRef = useRef<HTMLFormElement>(null)

    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadCreateAccountPage = () => { navigate(routes.createAccountPage) }

    // Form Data
    const [formData, setFormData] = useState<SignInAccountFormData>({
      email: "",
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
      if (!formData.email) {
        console.warn("Email is Required")
        return false
      }
      if (!formData.password) {
        console.warn("Password is Required")
        return false
      }
      return true
    }

    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Handle Sign In Account
    const handleSignInAccount = async (event: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault()

      const isValidFormData: boolean = validateFormData()
      if (!isValidFormData) {
        console.warn("Form Data is Invalid")
        return
      }
      const body: SignInAccountRawBody = {
        email: formData.email,
        password: formData.password
      }
      const result: SignInAccountResult = await requestSignInAccount(body)
      if (!result.success) { return }
      currentAccount.setID(result.accountID)
      navigate(routes.currentAccountPage)
    }

    // Fancy Input Colors
    const fancyInputColors: FancyColorSet = fancyColors.set02
    
    // Fancy Input Styles
    const fancyInputStyles: FancyInputStyles = {
      flexDirection: "row"
    }

    // Fancy Button Styles
    const fancyButtonStyles: FancyButtonStyles = {
      width: "max-content",
      height: "5rem"
    }

    // Return Content
    return (
      <form ref={formRef} onSubmit={handleSignInAccount} className={styles.form}>
        <FancyInput
          colors={fancyInputColors}
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
          colors={fancyInputColors}
          styles={fancyInputStyles}
          label="Password:"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          handleChange={handleInputChange}
        />
        <div className={styles.buttons}>
          <FancyButton
            colors={fancyColors.set01}
            styles={fancyButtonStyles}
            type="text"
            text="Create Account"
            action={loadCreateAccountPage}
          />
          <FancyButton
            colors={fancyColors.set03}
            styles={fancyButtonStyles}
            type="text"
            text="Sign In"
            action={() => formRef.current?.requestSubmit()}
          />
        </div>
      </form>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Sign In Account Form")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
