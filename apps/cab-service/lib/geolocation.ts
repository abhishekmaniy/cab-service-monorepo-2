import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const getCoordinates = async (address: string) => {
  try {
    const results = await geocodeByAddress(address);
    const coords = await getLatLng(results[0]);
    return coords;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};
