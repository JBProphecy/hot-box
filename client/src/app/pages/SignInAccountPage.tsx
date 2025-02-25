////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef } from "react"
import styles from "./SignInAccountPage.module.css"
import SignInAccountForm from "@/app/forms/SignInAccountForm"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function SignInAccountPage() {
  try {
    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])
    
    // Return Content
    return (
      <div ref={pageRef} className={styles.page}>
        <h1>Sign In Account</h1>
        <div className={styles.formContainer}>
          <SignInAccountForm />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Sign In Account Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
