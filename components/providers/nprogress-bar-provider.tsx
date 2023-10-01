'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export const NProgressBarProvider = () => {
  return (
    <AppProgressBar
      height="4px"
      shallowRouting
      color="#2563EB"
      options={{ showSpinner: false }}
    />
  )
}
