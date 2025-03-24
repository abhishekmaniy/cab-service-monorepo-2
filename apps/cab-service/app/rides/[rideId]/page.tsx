'use client'

import Map from '@/components/Map'
import { useLoadScript } from '@react-google-maps/api'
import { useParams } from 'next/navigation'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

export default function Ride () {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  const params = useParams()
  const rideId = params.rideId

  return (
    <>
      {isLoaded ? (
        <div className='space-y-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Driver Dashboard</h1>
          <Map />
          <div className='grid md:grid-cols-2 gap-8'>{rideId}</div>
        </div>
      ) : (
        <span>Loading Map...</span>
      )}
    </>
  )
}
