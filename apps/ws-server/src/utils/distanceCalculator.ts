interface CordinateType {
  lat: number
  lng: number
}

export function getDistance ({
  coord1,
  coord2
}: {
  coord1: CordinateType
  coord2: CordinateType
}) {
  const R = 6371 // Earth's radius in km
  const lat1 = coord1.lat * (Math.PI / 180)
  const lon1 = coord1.lng * (Math.PI / 180)
  const lat2 = coord2.lat * (Math.PI / 180)
  const lon2 = coord2.lng * (Math.PI / 180)

  const dlat = lat2 - lat1
  const dlon = lon2 - lon1

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c 
}
