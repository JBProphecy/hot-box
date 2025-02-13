////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import localStyles from "./FullScreenLayout.module.css"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type FullScreenLayoutProps = { children: React.ReactNode }

export default function FullScreenLayout(props: FullScreenLayoutProps) {
  return (
    <div className={localStyles.fullScreen}>
      <div className={localStyles.background}>
        <div className={localStyles.layer}></div>
        <div className={localStyles.layer}></div>
      </div>
      <div className={localStyles.content}>
        <div className={localStyles.container}>{props.children}</div>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
