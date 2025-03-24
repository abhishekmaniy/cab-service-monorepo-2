import { create } from 'zustand'

export interface Ride {
  riderId: string
  pickup: string
  destination: string
}

type RideStore = {
  availableRide: Ride[]
  setAvailableRide: (ride: Ride) => void
}

export const useRideStore = create<RideStore>(set => ({
  availableRide: [],

  setAvailableRide: ride =>
    set(state => ({
      availableRide: [...state.availableRide, ride] 
    }))
}))
