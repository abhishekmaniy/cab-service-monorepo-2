'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Ride } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Rides = () => {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch('/api/get-ride')
        const data = await response.json() // Parse JSON
        setRides(data) // Update state with fetched rides
        console.log(data)
      } catch (error) {
        console.error('Error fetching rides:', error)
      }
    }

    fetchRides()
  }, [])

  const router = useRouter()

  return (
    <div className='text-white'>
      {rides.length === 0 ? (
        <p>No Rides Available</p>
      ) : (
        <div className='p-10'>
          <Table>
            <TableCaption>A list of your recent Rides.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='text-right'>Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map(ride => (
                <TableRow
                  key={ride.id}
                  onClick={() => router.push(`/rides/${ride.id}`)}
                >
                  <TableCell className='font-medium'>
                    {ride.pickupLat}
                    {ride.pickupLng}
                  </TableCell>
                  <TableCell>
                    {ride.destinationLat}
                    {ride.destinationLng}
                  </TableCell>
                  <TableCell>{ride.price.toString()}</TableCell>
                  <TableCell className='text-right'>{ride.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Rides
