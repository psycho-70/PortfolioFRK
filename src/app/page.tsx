import React from 'react'
import MainLayout from './home-components/MainLayout'

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const page = () => {
  return (
    <main>
      <MainLayout />
    </main>
  )
}

export default page
