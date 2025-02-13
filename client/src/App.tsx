////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import FullScreenLayout from "@/app/FullScreenLayout"
import DevPage from "@/app/DevPage"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function App() {
  try {
    return (
      <FullScreenLayout>
        <DevPage />
      </FullScreenLayout>
    )
  }
  catch (object: unknown) {
    const error = object as Error
    console.error("App Error")
    console.log(error)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
