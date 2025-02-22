////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useContext, useEffect, useRef, useState } from "react"
import localStyles from "./CreateProfilePage.module.css"
import useDimensions from "@/hooks/useDimensions"
import { toPixelString, VariableStyles } from "@/utils/styles"
import { CreateProfileRawBody } from "shared/types/api/CreateProfileTypes"
import requestCreateProfile from "@/api/requestCreateProfile"
import { CurrentAccountContext, CurrentAccountContextType } from "@/context/CurrentAccountContext"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateProfilePage() {
  const currentAccount: CurrentAccountContextType | undefined = useContext(CurrentAccountContext)
  if (typeof currentAccount === "undefined") { throw new Error("Missing Current Account Provider") }

  const pageRef = useRef<HTMLDivElement>(null)
  const pageDimensions = useDimensions(pageRef)
  useEffect(() => { pageRef.current?.classList.add(localStyles.visible) }, [])
  const variableStyles: VariableStyles = {
    "--pageWidth": toPixelString(pageDimensions.width),
    "--pageHeight": toPixelString(pageDimensions.height)
  }

  const [formData, setFormData] = useState<CreateProfileRawBody>({
    name: "",
    username: "",
    password: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const validateFormData = (data: CreateProfileRawBody): boolean => {
    const { name, username, password } = data
    if (typeof name === "undefined") {
      console.warn("Name is Required")
      return false
    }
    if (typeof username === "undefined") {
      console.warn("Username is Required")
      return false
    }
    if (typeof password === "undefined") {
      console.warn("Password is Required")
      return false
    }
    return true
  }

  const handleCreateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValidFormData: boolean = validateFormData(formData)
    if (!isValidFormData) { return }
    const accountID: string | null = currentAccount.getID
    if (accountID === null) {
      console.warn("Missing Account ID")
      return
    }
    formData.accountID = accountID

    await requestCreateProfile(formData)
  }

  try {
    return (
      <div ref={pageRef} className={localStyles.page} style={variableStyles}>
        <div className={localStyles.formContainer}>
          <form className={localStyles.form} onSubmit={handleCreateProfile}>
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
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
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
    console.error("Error Loading Create Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
