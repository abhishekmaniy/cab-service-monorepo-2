import Redis from "ioredis";
import { Server } from "socket.io";

const pub = new Redis({
  host: process.env.REDIS_HOST!,
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD!,
});

const sub = new Redis({
  host: process.env.REDIS_HOST!,
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD!,
});

class SocketService {
  private _io: Server;

  constructor(httpServer: any) {
    console.log("✅ Initializing Socket Service...");

    this._io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    sub.subscribe("available_driver");
    sub.subscribe("ride_requests");
  }

  public initListeners() {
    const io = this._io;
    console.log("🎧 Initializing Socket Listeners...");

    io.on("connection", (socket) => {
      console.log(`🔗 Client connected: ${socket.id}`);

      socket.on("event:available_driver", async ({ driverId, location }) => {
        console.log(`🚖 Driver ${driverId} available at ${location}`);

        await pub.publish(
          "available_driver",
          JSON.stringify({ driverId, location })
        );
      });

      socket.on("event:request_ride", async ({ riderId, pickup, destination }) => {
        console.log(`📍 Ride requested by ${riderId} from ${pickup} to ${destination}`);

        await pub.publish(
          "ride_requests",
          JSON.stringify({ riderId, pickup, destination })
        );
        console.log("ride published to redis")
      });

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "ride_requests") {
        const rideData = JSON.parse(message);
        console.log("🚖 New Ride Request:", rideData);

        if (io.sockets.sockets.size > 0) {
          io.emit("event:new_ride", rideData);
        } else {
          console.log("⚠️ No active drivers to receive ride request.");
        }
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
