////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef } from "react"
import styles from "./AddProfilePage.module.css"
import AddProfileForm from "@/app/forms/AddProfileForm"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function AddProfilePage() {
  try {
    // Page Ref
    const pageRef = useRef<HTMLDivElement>(null)

    // Page Effects
    useEffect(() => { setTimeout(() => { pageRef.current?.classList.add(styles.visible) }, 150) }, [])
    
    // Return Content
    return (
      <div ref={pageRef} className={styles.page}>
        <h1>Add Profile</h1>
        <div className={styles.formContainer}>
          <AddProfileForm />
        </div>
      </div>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("Error Loading Add Profile Page")
    console.error(error)
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
