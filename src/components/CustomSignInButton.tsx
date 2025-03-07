"use client"
import React from 'react'
import { Button } from './ui/button'
import { SignInButton } from '@clerk/nextjs'

const CustomSignInButton = () => {
  return (
    <div className='mt-3'>
        <SignInButton mode='modal'>
          <Button>Sign In</Button>
        </SignInButton>
    </div>
  )
}

export default CustomSignInButton