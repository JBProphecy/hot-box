////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useRef, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./SignInAccountForm.module.css"
import routes from "@/library/routes"

import { SignInAccountRawBody } from "shared/types/api/SignInAccountTypes"
import requestSignInAccount, { SignInAccountResult } from "@/api/requestSignInAccount"

import useKeyable from "@/hooks/useKeyable"
import useClickable from "@/hooks/useClickable"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SignInAccountFormData = {
  email: string
  password: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInAccountForm() {
  try {
    // Current Account
    const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
    if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

    // Navigation
    const navigate: NavigateFunction = useNavigate()
    const loadCreateAccountPage = () => { navigate(routes.createAccountPage) }

    // Refs
    const createAccountButtonRef = useRef<HTMLInputElement>(null)
    const signInButtonRef = useRef<HTMLInputElement>(null)

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

    // Handle Sign In Account
    const handleSignInAccount = async () => {
      const body: SignInAccountRawBody = {
        email: formData.email,
        password: formData.password
      }
      const result: SignInAccountResult = await requestSignInAccount(body)
      if (!result.success) { return }
      currentAccount.setID(result.accountID)
      navigate(routes.currentAccountPage)
    }

    // Keyable
    const { handleKeyDown: handleKeyDownCreateAccountButton, handleKeyUp: handleKeyUpCreateAccountButton } = useKeyable({
      element: createAccountButtonRef,
      activeClass: styles.active,
      key: "Enter",
      action: loadCreateAccountPage
    })
    const { handleKeyDown: handleKeyDownSignInButton, handleKeyUp: handleKeyUpSignInButton } = useKeyable({
      element: signInButtonRef,
      activeClass: styles.active,
      key: "Enter",
      action: handleSignInAccount
    })

    // Clickable
    const { handleMouseDown: handleMouseDownCreateAccountButton, handleMouseUp: handleMouseUpCreateAccountButton } = useClickable({
      element: createAccountButtonRef,
      activeClass: styles.active,
      action: loadCreateAccountPage
    })
    const { handleMouseDown: handleMouseDownSignInButton, handleMouseUp: handleMouseUpSignInButton } = useClickable({
      element: signInButtonRef,
      activeClass: styles.active,
      action: handleSignInAccount
    })


    // Return Content
    return (
      <form className={styles.form}>
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
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="set password"
            required
          />
        </div>
        <div>
          <input
            ref={createAccountButtonRef}
            type="button"
            value="Create Account"
            onKeyDown={handleKeyDownCreateAccountButton}
            onKeyUp={handleKeyUpCreateAccountButton}
            onMouseDown={handleMouseDownCreateAccountButton}
            onMouseUp={handleMouseUpCreateAccountButton}
          />
          <input
            ref={signInButtonRef}
            type="button"
            value="Sign In"
            onKeyDown={handleKeyDownSignInButton}
            onKeyUp={handleKeyUpSignInButton}
            onMouseDown={handleMouseDownSignInButton}
            onMouseUp={handleMouseUpSignInButton}
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
