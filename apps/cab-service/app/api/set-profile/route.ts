import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {prisma as prismaClient} from "db"

export const POST = async (req: Request) => {
  console.log(req.method)

  const { userId } = await auth()
  const client = await clerkClient()

  try {
    const user = await client.users.getUser(userId!)
    const { role } = await req.json()

    if (!user || !role) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (role === 'driver') {
      console.log('Reached here')

      console.log(
        userId,
        user.emailAddresses?.[0]?.emailAddress,
        `${user.firstName ?? ''} ${user.lastName ?? ''}`
      )

      const newUser = await prismaClient.driver.create({
        data: {
          id: userId!,
          email: user.emailAddresses?.[0]?.emailAddress ?? '',
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`
        }
      })
      console.log(newUser)

      return NextResponse.json(newUser, { status: 200 })
    } else if (role === 'passenger') {
      const newUser = await prismaClient.passenger.create({
        data: {
          id: userId!,
          email: user.emailAddresses?.[0]?.emailAddress ?? '',
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`
        }
      })
      return NextResponse.json(newUser, { status: 201 })
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
