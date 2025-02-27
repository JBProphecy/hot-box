////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef } from "react"
import styles from "./SignInProfilePage.module.css"
import SignInProfileForm from "@/app/forms/SignInProfileForm"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInProfilePage() {
  try {
    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])
    
    // Return Content
    return (
      <div ref={pageRef} className={styles.page}>
        <h1>Sign In Profile</h1>
        <div className={styles.formContainer}>
          <SignInProfileForm />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Sign In Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
