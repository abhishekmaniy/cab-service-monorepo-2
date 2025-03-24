export const createRide = async ({
    pickupCoords,
    dropoffCoords,
    riderId,
    price,
  }: {
    pickupCoords: { lat: number; lng: number };
    dropoffCoords: { lat: number; lng: number };
    riderId: string | null;
    price: number;
  }) => {
    const response = await fetch('/api/create-ride', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        destinationLat: dropoffCoords.lat,
        destinationLng: dropoffCoords.lng,
        riderId,
        price,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Error while creating ride');
    }
  
    return response.json();
  };
  