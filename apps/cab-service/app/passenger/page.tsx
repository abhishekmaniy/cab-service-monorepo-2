'use client'

import Map from '@/components/Map'
import RideRequest from '@/components/RiderRequest'
import RideStatus from '@/components/RideStatus'
import { useLoadScript } from '@react-google-maps/api'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

export default function RiderPage () {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  return (
    <>
      {isLoaded ? (
        <div className='space-y-8'>
          <h1 className='text-3xl font-bold text-white'>Rider Dashboard</h1>
          <Map />
          <div className='grid md:grid-cols-2 gap-8'>
            <RideRequest />
            <RideStatus role='rider' />
          </div>
        </div>
      ) : (
        <span>Loading Map...</span>
      )}
    </>
  )
}
