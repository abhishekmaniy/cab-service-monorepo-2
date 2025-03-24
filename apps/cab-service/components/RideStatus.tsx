'use client'

import { useLocationStore } from '@/app/store/locationStore'
import { Button } from '@/components/ui/button'
import useWebSocket from '@/hooks/useSocket'
import { getCoordinates } from '@/lib/geolocation'
import { createRide } from '@/services/rideService'
import { useAuth } from '@clerk/nextjs'
import { Ride } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RideStatus ({ role }: { role: 'rider' | 'driver' }) {
  const { price, pickupLocation, dropoffLocation } = useLocationStore()
  const { userId } = useAuth()
  const socket = useWebSocket(userId ?? '', 'rider')
  const [noDrivers, setNoDrivers] = useState(false)
  const router = useRouter()

  useEffect(() => {
    socket?.on('event:no_drivers_available', () => {
      console.log('No Drivers are available')
      setNoDrivers(true)
    })
  }, [socket])

  useEffect(() => {
    socket?.on('event:ride_assigned', ride => {
      alert('RIde Assigned to you')
      console.log(ride)
    })
  }, [socket])

  useEffect(() => {
    socket?.on('event:ride_confirmed', driverId => {
      alert('Your ride is assign to drivers')
      console.log(driverId)
    })
  }, [socket])

  const handleConfirmRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      return alert('Pickup and dropoff locations are required')
    }

    const pickupCoords = await getCoordinates(pickupLocation)
    const dropoffCoords = await getCoordinates(dropoffLocation)

    if (!pickupCoords || !dropoffCoords) {
      return alert('Invalid pickup & destination location')
    }

    try {
      const ride: Ride = await createRide({
        pickupCoords,
        dropoffCoords,
        riderId: userId ?? null,
        price: parseFloat(price)
      })

      if (socket) {
        socket.emit('event:request_ride', {
          riderId: userId,
          pickup: pickupLocation,
          destination: dropoffLocation,
          pickupCoords,
          dropoffCoords,
          price,
          rideId: ride.id
        })
        alert('Ride Created')
        router.push(`/passenger-callback`)
      } else {
        alert('Socket connection not established')
      }
    } catch (error) {
      alert('Failed to create ride')
      console.error(error)
    }
  }

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200'>
      {role === 'rider' ? (
        <>
          <h2 className='text-2xl font-bold mb-6 text-white'>Ride Status</h2>
          {!pickupLocation || !dropoffLocation ? (
            <span className='text-white'>
              Enter valid Pickup & Destnation Point
            </span>
          ) : (
            <>
              <div className='space-y-4 mb-6'>
                <p className='text-gray-400'>
                  <strong>Pickup:</strong> {pickupLocation}
                </p>
                <p className='text-gray-400'>
                  <strong>Dropoff:</strong> {dropoffLocation}
                </p>
                <p className='text-gray-400'>
                  <strong>Price:</strong> {price}
                </p>
              </div>
              <div>
                {noDrivers && (
                  <span> No Drivers are available for your ride</span>
                )}
              </div>
              <Button
                onClick={handleConfirmRide}
                className='w-full bg-gray-800 hover:bg-gray-700'
              >
                Confirm Ride
              </Button>
            </>
          )}
        </>
      ) : (
        <div>
          <h1 className='text-white text-2xl'></h1>
        </div>
      )}
    </div>
  )
}
