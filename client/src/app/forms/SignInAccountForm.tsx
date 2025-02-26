////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./CreateAccountForm.module.css"
import routes from "@/config/routes"

import { SignInAccountRawBody } from "shared/types/api/SignInAccountTypes"
import requestSignInAccount, { SignInAccountResult } from "@/api/requestSignInAccount"

import FancyInput, { FancyInputProps } from "@/app/components/FancyInput"
import threeColorSets from "@/app/library/threeColorSets"

import TextButton, { TextButtonProps } from "@/app/components/buttons/TextButton"

import { CurrentAccountContext, CurrentAccountContextType } from "@/app/context/CurrentAccountContext"

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
      event.preventDefault()

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

    // Shared Fancy Input Props
    const sharedFancyInputProps: FancyInputProps = {
      handleChange: handleInputChange,
      colors: threeColorSets.set03,
      styles: {
        flexDirection: "row"
      }
    }

    // Shared Text Button Props
    const sharedTextButtonProps: TextButtonProps = {
      height: 5,
      unit: "rem"
    }

    // Return Content
    return (
      <form ref={formRef} onSubmit={handleSignInAccount} className={styles.form}>
        <FancyInput
          {...sharedFancyInputProps}
          label="Email:"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
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
          <TextButton
            {...sharedTextButtonProps}
            text="Create Account"
            pressedAction={loadCreateAccountPage}
            activeColors={threeColorSets.set01}
          />
          <TextButton
            {...sharedTextButtonProps}
            text="Sign In"
            pressedAction={() => formRef.current?.requestSubmit()}
            activeColors={threeColorSets.set03}
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
