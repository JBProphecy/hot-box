////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import styles from "./RootLayout.module.css"
import AppLayout from "@/layouts/AppLayout"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function RootLayout() {
  return (
    <div className={styles.rootLayout}>
      <div className={styles.background}>
        <div className={styles.layer}></div>
        <div className={styles.layer}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
          <AppLayout />
        </div>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
