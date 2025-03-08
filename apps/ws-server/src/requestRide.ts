import Redis from 'ioredis';

const pub = new Redis({
  host: '',
  port: 0,
  username: 'default',
  password: ''
});

export async function requestRide(pickup: string, destination: string) {
  const ride = {
    id: Math.random().toString(36).substr(2, 9),
    pickup,
    destination
  };

  await pub.publish('ride_request', JSON.stringify(ride));
  console.log('Ride request sent:', ride);
}
