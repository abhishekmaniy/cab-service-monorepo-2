import { NextRequest, NextResponse } from 'next/server'
import { prisma as prismaClient } from 'db'

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
  }

  try {
    const isPassenger = await prismaClient.passenger.findUnique({
      where: { id: userId }
    })

    const isDriver = await prismaClient.driver.findUnique({
      where: { id: userId }
    })

    if (!isPassenger && !isDriver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (isPassenger) {
      return NextResponse.json({ role: 'passenger' }, { status: 200 })
    }

    if (isDriver) {
      return NextResponse.json({ role: 'driver' }, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
