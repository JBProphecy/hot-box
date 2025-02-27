////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef } from "react"
import styles from "./CreateProfilePage.module.css"
import CreateProfileForm from "@/app/forms/CreateProfileForm"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CreateProfilePage() {
  try {
    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])
    
    // Return Content
    return (
      <div ref={pageRef} className={styles.page}>
        <h1>Create Profile</h1>
        <div className={styles.formContainer}>
          <CreateProfileForm />
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
