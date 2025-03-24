'use client'

import { Button } from '@/components/ui/button'
import { calculatePrice } from '@/lib/getPrice'
import { Autocomplete } from '@react-google-maps/api'
import { useRef } from 'react'
import { useLocationStore } from '../app/store/locationStore'
import { Input } from './ui/input'

export default function RideRequest () {
  const originRef = useRef<HTMLInputElement>(null)
  const destinationRef = useRef<HTMLInputElement>(null)
  
  const {
    setPrice,
    setDropoffLocation,
    setPickupLocation,
    setDistance,
    setDuration,
    pickupLocation,
    dropoffLocation
  } = useLocationStore()

  const handleRequest = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert('Please enter both pickup & dropoff locations')
      return
    }

    if (!originRef.current || !destinationRef.current) {
      alert('Location input fields are not accessible.')
      return
    }

    try {
      if (!google?.maps?.DirectionsService) {
        throw new Error('Google Maps API is not loaded.')
      }

      const directionsService = new google.maps.DirectionsService()

      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING
      })

      if (!results.routes.length) {
        throw new Error('No routes found')
      }

      const leg = results.routes[0].legs[0]
      const distanceText = leg.distance?.text || 'Unknown'
      const durationText = leg.duration?.text || 'Unknown'

      setDistance(distanceText)
      setDuration(durationText)

      const ridePrice = calculatePrice(distanceText, durationText)
      setPrice(ridePrice)

      console.log('Distance:', distanceText)
      console.log('Duration:', durationText)
    } catch (error) {
      console.error('Error Creating Ride:', error)
      alert('Something went wrong! Please try again.')
    }
  }

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-white'>Request a Ride</h2>
      <div className='space-y-6'>
        {/* Pickup Location */}
        <div className='relative'>
          <Autocomplete>
            <Input
              value={pickupLocation || ''}
              onChange={e => setPickupLocation(e.target.value)}
              placeholder='Enter pickup location'
              ref={originRef}
            />
          </Autocomplete>
        </div>

        {/* Dropoff Location */}
        <div className='relative'>
          <Autocomplete>
            <Input
              value={dropoffLocation || ''}
              onChange={e => setDropoffLocation(e.target.value)}
              placeholder='Enter dropoff location'
              ref={destinationRef}
            />
          </Autocomplete>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleRequest}
          className='w-full bg-gray-800 hover:bg-gray-700'
        >
          Request Ride
        </Button>
      </div>
    </div>
  )
}
