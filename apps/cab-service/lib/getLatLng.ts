'use server'

import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client()


export const getLatLng = async (placeId: string) => {
  try {
    const response = await client.geocode({
      params: {
        place_id: placeId,
        key: process.env.NEXT_PUBLIC_GOOGLEMAP_API!
      }
    })

    const location = response.data.results[0]?.geometry.location

    console.log(location)

    return location ? { lat: location.lat, lng: location.lng } : null
  } catch (error) {
    console.error('Error fetching coordinates:', error)
    return null
  }
}