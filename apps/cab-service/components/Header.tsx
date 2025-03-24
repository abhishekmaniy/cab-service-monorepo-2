'use client'

import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export default function Header () {
  const { isSignedIn } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && isSignedIn) {
      router.push('/auth-callback')
    }
  }, [isMounted, isSignedIn, router])

  return (
    <header className='bg-black text-white p-4 shadow-lg'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>
          Maniyar Cab Service
        </Link>
        <div>
          {isSignedIn ? (
            <div className="flex items-center" >
              <Button onClick={() => router.push('/rides')}>Your Rides</Button>
              <UserButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  )
}
