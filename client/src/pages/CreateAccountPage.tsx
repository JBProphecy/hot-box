////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef } from "react"
import styles from "./CreateAccountPage.module.css"
import CreateAccountForm from "@/pages/CreateAccountForm"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateAccountPage() {
  try {
    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])
    
    // Return Content
    return (
      <div ref={pageRef} className={styles.page}>
        <div className={styles.formContainer}>
          <CreateAccountForm />
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
