import { getAuth } from '@clerk/nextjs/server'
import {prisma as prismaClient} from "db"
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rides = await prismaClient.ride.findMany({
      where: {
        OR: [{ driverId: userId }, { passengerId: userId }]
      }
    })

    return NextResponse.json(rides, { status: 200 })
  } catch (error) {
    console.log('Error In Getting Ride', error)
    return NextResponse.json(
      { error: 'Error in internal server' },
      { status: 500 }
    )
  }
}
