'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

const Page = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true)
      const response = await fetch(`/api/get-user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data.role)
        router.push(`/${data.role}`)
      } else {
        router.push('/select-role')
      }
      setLoading(false)
    }
    if (userId) {
      checkUser()
    }
  }, [userId , router])

  return (
    <div className='bg-black text-white'>
      {loading ? 'Loading...' : 'Getting Your Account Detail...'}
    </div>
  )
}

export default Page
