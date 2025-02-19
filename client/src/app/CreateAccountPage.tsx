////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef, useState } from "react"
import localStyles from "./CreateAccountPage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CreateAccountRequestBody } from "shared/types/CreateAccountTypes"
import requestCreateAccount from "@/api/requestCreateAccount"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateAccountPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageWidth, pageHeight] = useDimensions(pageRef)
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageWidth),
    "--pageHeight": toPixelString(pageHeight)
  }

  const [formData, setFormData] = useState<CreateAccountRequestBody>({
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

  const validateFormData = (data: CreateAccountRequestBody): boolean => {
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

    await requestCreateAccount(formData)
  }

  try {
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <form onSubmit={handleCreateAccount}>
          <div>
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
