'use client'

import { Ride, useRideStore } from '@/app/store/rideStore'
import { Switch } from '@/components/ui/switch'
import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export default function DriverDashboard () {
  const [isAvailable, setIsAvailable] = useState(false)
  const { availableRide, setAvailableRide } = useRideStore()
  const { userId } = useAuth()
  const socket = useWebSocket(userId ?? '', 'driver')

  useEffect(() => {
    if (!socket) return

    // Listen for new ride requests
    socket.on('event:ride_assigned', (ride: Ride) => {
      console.log('🚗 New Ride Request Received:', ride)
      setAvailableRide(ride) // Store ride details
    })

    return () => {
      socket.off('event:ride_assigned')
    }
  }, [socket, setAvailableRide])

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable)

    if (!isAvailable && socket) {
      // Get driver's real-time location
      navigator.geolocation.getCurrentPosition(position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        socket.emit('event:available_driver', {
          driverId: userId,
          location
        })

        console.log('📍 Driver available at:', location)
      })
    }
  }

  const handleAcceptRide = (ride: Ride) => {
    if (!socket) return

    console.log('✅ Ride Accepted:', ride)

    socket.emit(
      'event:ride_accepted',
      {
        driverId: userId,
        riderId: ride.riderId,
        pickup: ride.pickup,
        destination: ride.destination
      },
      (ack: any) => {
        console.log('🚀 Event Acknowledgment:', ack)
      }
    )
  }

  const handleRejectRide = (ride: Ride) => {
    if (!socket) return

    console.log('❌ Ride Rejected:', ride)

    socket.emit('event:ride_rejected', {
      driverId: userId,
      riderId: ride.riderId,
      pickup: ride.pickup,
      destination: ride.destination
    })
  }

  useEffect(() => {
    if (!socket || !isAvailable) return

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        socket.emit('event:driver_location_update', {
          driverId: userId,
          location
        })

        console.log('📡 Location updated:', location)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [socket, isAvailable, setAvailableRide, userId])

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Driver Dashboard
      </h2>

      <div className='flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg'>
        <span className='text-lg font-semibold text-gray-700'>
          Available for rides:
        </span>
        <Switch
          checked={isAvailable}
          onCheckedChange={toggleAvailability}
          className='data-[state=checked]:bg-green-500'
        />
      </div>

      {availableRide && isAvailable && (
        <div className='space-y-4 p-4 bg-blue-50 rounded-lg'>
          <h3 className='text-xl font-semibold text-blue-800'>
            New Ride Request
          </h3>
          {availableRide.map(ride => (
            <>
              <span>Pickup: {ride.pickup}</span>
              <span>Destination: {ride.destination}</span>
              <Button onClick={() => handleAcceptRide(ride)}>
                Accept Ride
              </Button>
              <Button onClick={() => handleRejectRide(ride)}>
                Reject Ride
              </Button>
            </>
          ))}
        </div>
      )}
    </div>
  )
}
