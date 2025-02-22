////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import localStyles from "./CreateAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { SignInAccountRawBody } from "shared/types/api/SignInAccountTypes"
import requestSignInAccount, {SignInAccountResult } from "@/api/requestSignInAccount"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/library/routes"

import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInAccountPage() {
  const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
  if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }
  
  const pageRef = useRef<HTMLDivElement>(null)
  const pageDimensions = useDimensions(pageRef)
  useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageDimensions.width),
    "--pageHeight": toPixelString(pageDimensions.height)
  }

  const navigate: NavigateFunction = useNavigate()

  const [formData, setFormData] = useState<SignInAccountRawBody>({
    email: "",
    password: ""
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const validateFormData = (data: SignInAccountRawBody): boolean => {
    const { email, password } = data
    if (typeof email === "undefined") {
      console.warn("Email is Required")
      return false
    }
    if (typeof password === "undefined") {
      console.warn("Password is Required")
      return false
    }
    return true
  }

  const handleSignInAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValidFormData: boolean = validateFormData(formData)
    if (!isValidFormData) { return }

    const result: SignInAccountResult = await requestSignInAccount(formData)
    if (!result.success) { return }
    currentAccount.setID(result.accountID)

    navigate(routes.currentAccountPage)
  }

  try {
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <form onSubmit={handleSignInAccount}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              required
            />
          </div>
          <div>
            <input type="submit" value="Submit" />
            <input type="button" value="Go Back" />
          </div>
        </form>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Create Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
