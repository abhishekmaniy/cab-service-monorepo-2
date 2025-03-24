'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelection = async (role: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/set-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      if (response.ok) {
        router.push(`/${role}`)
      } else {
        console.error('Failed to set profile')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='bg-black text-white'>
        <h2>Setting up your account...</h2>
      </div>
    )
  }

  return (
    <div
      className='bg-black text-white'
      style={{ textAlign: 'center', marginTop: '50px' }}
    >
      <h1>Select Your Role</h1>
      <div
        onClick={() => handleRoleSelection('driver')}
        style={{
          cursor: 'pointer',
          padding: '10px 20px',
          margin: '10px',
          border: '1px solid black',
          display: 'inline-block'
        }}
      >
        Driver
      </div>
      <div
        onClick={() => handleRoleSelection('passenger')}
        style={{
          cursor: 'pointer',
          padding: '10px 20px',
          margin: '10px',
          border: '1px solid black',
          display: 'inline-block'
        }}
      >
        Passenger
      </div>
    </div>
  )
}

export default Page
