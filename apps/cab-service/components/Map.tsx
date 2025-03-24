'use client'

import { useLocationStore } from '@/app/store/locationStore'
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api'
import { LocateIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Button } from './ui/button'

export default function Map() {
  const {
    location,
    pickupLocation,
    dropoffLocation,
    setLocation,
    setDistance,
    setDuration
  } = useLocationStore()

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)

  const originRef = useRef<HTMLInputElement | null>(null)
  const destinationRef = useRef<HTMLInputElement | null>(null)

  const defaultCenter = { lat: 27.2467, lng: 17.1346 }

  const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  }

  // Get user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        error => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      )
    }
  }, [setLocation])

  // Convert pickup and dropoff addresses to coordinates
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        if (pickupLocation) {
          const pickupResults = await geocodeByAddress(pickupLocation)
          const pickupLatLng = await getLatLng(pickupResults[0])
          setPickupCoords(pickupLatLng)
        }

        if (dropoffLocation) {
          const dropoffResults = await geocodeByAddress(dropoffLocation)
          const dropoffLatLng = await getLatLng(dropoffResults[0])
          setDropoffCoords(dropoffLatLng)
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error)
      }
    }

    fetchCoordinates()
  }, [pickupLocation, dropoffLocation])

  // Calculate the shortest route
  const calculateRoute = async () => {
    if (!pickupCoords || !dropoffCoords) {
      return alert('Invalid pickup & destination location')
    }

    const directionsService = new google.maps.DirectionsService()
    const result = await directionsService.route({
      origin: new google.maps.LatLng(pickupCoords.lat, pickupCoords.lng),
      destination: new google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng),
      travelMode: google.maps.TravelMode.DRIVING
    })

    setDirectionsResponse(result)
    setDistance(result.routes[0].legs[0].distance?.text || '')
    setDuration(result.routes[0].legs[0].duration?.text || '')
  }

  const clearRoute = () => {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setPickupCoords(null)
    setDropoffCoords(null)

    if (originRef.current) originRef.current.value = ''
    if (destinationRef.current) destinationRef.current.value = ''
  }

  return (
    <div className='bg-black h-64 md:h-96 rounded-lg overflow-hidden shadow-inner relative'>
      <GoogleMap
        center={location ? { lat: location.latitude, lng: location.longitude } : defaultCenter}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={mapOptions}
      >
        {location && <Marker position={{ lat: location.latitude, lng: location.longitude }} />}
        {pickupCoords && <Marker position={pickupCoords} />}
        {dropoffCoords && <Marker position={dropoffCoords} />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      <Button
        onClick={calculateRoute}
        className='absolute bottom-2 left-2 bg-green-500 hover:bg-green-600 text-white rounded-lg p-2'
      >
        Calculate Route
      </Button>

      <Button
        onClick={clearRoute}
        className='absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2'
      >
        <LocateIcon />
      </Button>
    </div>
  )
}
