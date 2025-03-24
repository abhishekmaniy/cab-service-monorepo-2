import { create } from 'zustand'

export type Location = { latitude: number; longitude: number } | null

type LocationStore = {
  location: Location
  pickupLocation: string
  dropoffLocation: string
  distance: string
  duration: string
  price: string
  setLocation: (location: Location) => void
  setPickupLocation: (location: string) => void
  setDropoffLocation: (location: string) => void
  setDistance: (distance: string) => void
  setDuration: (duration: string) => void
  setPrice: (price: string) => void
}

export const useLocationStore = create<LocationStore>(set => ({
  location: null,
  pickupLocation: '',
  dropoffLocation: '',
  distance: '',
  duration: '',
  price: '',
  setLocation: location => set({ location }),
  setPickupLocation: location => set({ pickupLocation: location }),
  setDropoffLocation: location => set({ dropoffLocation: location }),
  setDistance: distance => set({ distance }),
  setDuration: duration => set({ duration }),
  setPrice: price => set({ price })
}))
