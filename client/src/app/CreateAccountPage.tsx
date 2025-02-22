////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef, useState } from "react"
import localStyles from "./CreateAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CreateAccountRawBody } from "shared/types/api/CreateAccountTypes"
import requestCreateAccount, { CreateAccountResult } from "@/api/requestCreateAccount"

import { NavigateFunction, useNavigate } from "react-router-dom"
import routes from "@/library/routes"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateAccountPage() {
  // Navigation
  const navigate: NavigateFunction = useNavigate()

  // Page Stuff
  const pageRef = useRef<HTMLDivElement>(null)
  const pageDimensions = useDimensions(pageRef)
  useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])

  // Variable Styles
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageDimensions.width),
    "--pageHeight": toPixelString(pageDimensions.height)
  }

  const [formData, setFormData] = useState<CreateAccountRawBody>({
    name: "",
    email: "",
    password: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const validateFormData = (data: CreateAccountRawBody): boolean => {
    const { name, email, password } = data
    if (typeof name === "undefined") {
      console.warn("Name is Required")
      return false
    }
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

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValidFormData: boolean = validateFormData(formData)
    if (!isValidFormData) { return }

    const result: CreateAccountResult = await requestCreateAccount(formData)
    if (!result.success) { return }
    navigate(routes.signInAccountPage )
  }

  try {
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <div className={localStyles.formContainer}>
          <form className={localStyles.form} onSubmit={handleCreateAccount}>
            <div className={localStyles.inputBox}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={localStyles.validationBox}>
              <span className={localStyles.validationText}>Blash</span>
              <span className={localStyles.validationText}>Blash</span>
            </div>
            <div className={localStyles.inputBox}>
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
            <div className={localStyles.inputBox}>
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
