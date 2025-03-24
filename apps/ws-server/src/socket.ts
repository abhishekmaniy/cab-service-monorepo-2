import Redis from 'ioredis'
import { Server } from 'socket.io'
import { getDistance } from './utils/distanceCalculator'

const riderSockets = new Map() // Stores { riderId: socketId }
const driverSockets = new Map() // Stores { driverId: socketId }

const pub = new Redis({
  host: process.env.REDIS_HOST!,
  port: 6379,
  username: 'default',
  password: process.env.REDIS_PASSWORD!
})

const sub = new Redis({
  host: process.env.REDIS_HOST!,
  port: 6379,
  username: 'default',
  password: process.env.REDIS_PASSWORD!
})

class SocketService {
  private _io: Server

  constructor (httpServer: any) {
    console.log('✅ Initializing Socket Service...')

    this._io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    sub.subscribe('available_driver')
    sub.subscribe('ride_requests')
  }

  public initListeners () {
    const io = this._io
    console.log('🎧 Initializing Socket Listeners...')
    const redisClient = new Redis({
      host: process.env.REDIS_HOST!,
      port: 6379,
      username: 'default',
      password: process.env.REDIS_PASSWORD!
    })

    io.on('connection', socket => {
      console.log(`🔗 Client connected: ${socket.id}`)

      socket.on('event:rider_join', ({ riderId }) => {
        if (riderSockets.has(riderId)) {
          io.sockets.sockets.get(riderSockets.get(riderId))?.disconnect()
        }
        riderSockets.set(riderId, socket.id)
        console.log(`👤 Rider ${riderId} connected with socket ${socket.id}`)
      })

      socket.on('event:driver_join', ({ driverId }) => {
        if (driverSockets.has(driverId)) {
          io.sockets.sockets.get(driverSockets.get(driverId))?.disconnect()
        }
        driverSockets.set(driverId, socket.id)
        console.log(`🚗 Driver ${driverId} connected with socket ${socket.id}`)
      })

      socket.on('event:available_driver', async ({ driverId, location }) => {
        console.log(`🚖 Driver ${driverId} available at ${location}`)

        await redisClient.hset(
          'available_drivers',
          driverId,
          JSON.stringify({ location })
        )

        await pub.publish(
          'available_driver',
          JSON.stringify({ driverId, location })
        )
      })

      socket.on(
        'event:driver_location_update',
        async ({ driverId, location }) => {
          console.log(
            `🚗 Driver ${driverId} updated location: ${location.lat}, ${location.lng}`
          )
          await redisClient.hset(
            'drivers_location',
            driverId,
            JSON.stringify(location)
          )
        }
      )

      socket.on(
        'event:request_ride',
        async ({
          riderId,
          pickup,
          destination,
          pickupCoords,
          dropoffCoords,
          price,
          rideId
        }) => {
          console.log(
            `📍 Ride requested by ${riderId} from ${pickup} to ${destination}`
          )

          const availableDrivers = await redisClient.hgetall(
            'available_drivers'
          )

          console.log('availableDrivers', availableDrivers)
          if (!availableDrivers || Object.keys(availableDrivers).length === 0) {
            console.log('🚫 No drivers available')
            const riderSocketId = riderSockets.get(riderId)
            if (riderSocketId) {
              io.to(riderSocketId).emit('event:no_drivers_available')
            }
            return
          }

          let driverQueue = Object.entries(availableDrivers)
            .map(([driverId, driverData]) => ({
              driverId,
              location: JSON.parse(driverData).location,
              distance: getDistance({
                coord1: pickupCoords,
                coord2: JSON.parse(driverData).location
              })
            }))
            .sort((a, b) => a.distance - b.distance)

          console.log('driverQueue', driverQueue)

          const assignRide = async () => {
            if (driverQueue.length === 0) {
              console.log('🚫 No drivers accepted the ride')
              const riderSocketId = riderSockets.get(riderId)
              if (riderSocketId) {
                io.to(riderSocketId).emit('event:no_drivers_available')
              }
              return
            }

            const nextDriver = driverQueue.shift()
            if (!nextDriver) {
              console.log('🚫 No drivers available in queue')
              return
            }
            const { driverId } = nextDriver
            console.log(`🚕 Assigning ride to Driver: ${driverId}`)

            const driverSocketId = driverSockets.get(driverId)
            const riderSocketId = riderSockets.get(riderId)

            const driverSocket = io.sockets.sockets.get(driverSocketId)
            if (driverSocket) {
              // Listen for response from that particular driver
              driverSocket.once('event:ride_accepted', () => {
                console.log(`✅ Driver ${driverId} accepted ride`)
                if (riderSocketId) {
                  io.to(riderSocketId).emit('event:ride_confirmed', {
                    driverId,
                    rideId
                  })
                }
                // Remove driver from available list
                redisClient.hdel('available_drivers', driverId)
              })

              driverSocket.once('event:ride_rejected', () => {
                console.log(`❌ Driver ${driverId} rejected ride`)
                assignRide() // Try assigning to the next driver
              })
            } else {
              console.log(`⚠️ Driver ${driverId} socket not found`)
              assignRide() // Try the next driver
            }
          }

          assignRide() // Start assignment process
        }
      )

      socket.on('disconnect', async () => {
        console.log(`❌ Client disconnected: ${socket.id}`)
        for (const [riderId, id] of riderSockets.entries()) {
          if (id === socket.id) {
            riderSockets.delete(riderId)
            console.log(`❌ Removed rider ${riderId} from tracking`)
          }
        }
        for (const [driverId, id] of driverSockets.entries()) {
          if (id === socket.id) {
            driverSockets.delete(driverId)
            await redisClient.hdel('available_drivers', driverId)
            console.log(`🗑️ Removed ${driverId} from available drivers`)
          }
        }
      })
    })

    sub.on('message', (channel, message) => {
      if (channel === 'ride_requests') {
        const rideData = JSON.parse(message)
        console.log('🚖 New Ride Request:', rideData)
        if (io.sockets.sockets.size > 0) {
          io.emit('event:new_ride', rideData)
        } else {
          console.log('⚠️ No active drivers to receive ride request.')
        }
      }
    })
  }

  get io () {
    return this._io
  }
}

export default SocketService
