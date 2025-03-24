'use client'

import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PassengerCallback = () => {
  const { userId } = useAuth()

  const socket = useWebSocket(userId ?? '', 'rider')

  const router = useRouter()

  useEffect(() => {
    if (!socket) return

    socket.on('event:ride_confirmed', ({ rideId }) => {
      alert('Your ride is assign to drivers')
      router.push(`/ride/${rideId}`)
    })
  }, [router, socket])

  return (
    <>
      {' '}
      <div>waiting for driver</div>
    </>
  )
}

export default PassengerCallback
