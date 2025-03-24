export const calculatePrice = (distance: string, duration: string) => {
    const baseFare = 2; // Fixed starting price ($2)
    const costPerKm = 0.5; // Cost per km ($0.5)
    const costPerMin = 0.2; // Cost per minute ($0.2)
    const serviceFeePercentage = 0.1; // 10% service fee
  
    // Convert "10 km" → 10 (number)
    const distanceInKm = parseFloat(distance.split(' ')[0]); 
    const durationInMin = parseFloat(duration.split(' ')[0]); 
  
    // Calculate total fare
    let totalPrice = baseFare + (costPerKm * distanceInKm) + (costPerMin * durationInMin);
  
    // Apply service fee
    const serviceFee = totalPrice * serviceFeePercentage;
    totalPrice += serviceFee;
  
    return totalPrice.toFixed(2); // Round to 2 decimal places
  };
  