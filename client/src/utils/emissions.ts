// Emissions calculation utility functions
import { apiRequest } from '@/lib/queryClient';

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  distance: number;
}

export interface EmissionsResult {
  emissionsAmount: string;
  relativeSaving: string;
  alternatives: Alternative[];
}

export interface Alternative {
  name: string;
  emissions: string;
  reduction: string;
}

// Calculate emissions based on vehicle data
export async function calculateEmissions(vehicleData: VehicleData, userId: number): Promise<EmissionsResult> {
  try {
    const { make, model, year, fuelType, distance } = vehicleData;
    
    // In a real implementation, this would make an API call to get more accurate data
    // For this demo, we'll use a simplified calculation
    
    // Base emission factors in g CO2 per km
    const emissionFactors = {
      petrol: 120,    // Average petrol car
      diesel: 110,    // Average diesel car
      hybrid: 80,     // Average hybrid car
      electric: 50    // Average electric car (including emissions from electricity production)
    };
    
    // Calculate total emissions
    const emissionFactor = emissionFactors[fuelType];
    const totalEmissions = (emissionFactor * distance) / 1000; // Convert to kg
    
    // Generate result
    const result: EmissionsResult = {
      emissionsAmount: `${totalEmissions.toFixed(1)} kg CO₂`,
      relativeSaving: getFuelTypeComparison(fuelType),
      alternatives: getAlternatives(distance, fuelType)
    };
    
    // Save the calculation to the database
    const calculationData = {
      userId,
      vehicleMake: make,
      vehicleModel: model,
      vehicleYear: year,
      fuelType,
      distance,
      emissionsAmount: result.emissionsAmount
    };
    
    await apiRequest('POST', '/api/emissions-calculations', calculationData);
    
    return result;
  } catch (error) {
    console.error('Error calculating emissions:', error);
    throw new Error('Failed to calculate emissions');
  }
}

// Get fuel type comparison text
function getFuelTypeComparison(fuelType: string): string {
  switch (fuelType) {
    case 'petrol':
      return 'This is comparable to the average car';
    case 'diesel':
      return 'This is 8% less than the average petrol car';
    case 'hybrid':
      return 'This is 33% less than the average car';
    case 'electric':
      return 'This is 58% less than the average car';
    default:
      return '';
  }
}

// Get alternative transportation options
function getAlternatives(distance: number, currentFuelType: string): Alternative[] {
  const alternatives: Alternative[] = [];
  
  // Public transportation
  const publicTransportEmissions = distance * 0.04;
  const publicTransportReduction = calculateReduction(
    distance * getEmissionFactor(currentFuelType),
    publicTransportEmissions
  );
  alternatives.push({
    name: 'Public Transportation',
    emissions: `${publicTransportEmissions.toFixed(1)} kg CO₂`,
    reduction: `${publicTransportReduction}% reduction`
  });
  
  // Electric vehicle (if not already using one)
  if (currentFuelType !== 'electric') {
    const electricEmissions = distance * 0.05;
    const electricReduction = calculateReduction(
      distance * getEmissionFactor(currentFuelType),
      electricEmissions
    );
    alternatives.push({
      name: 'Electric Vehicle',
      emissions: `${electricEmissions.toFixed(1)} kg CO₂`,
      reduction: `${electricReduction}% reduction`
    });
  }
  
  // Cycling/Walking
  const cyclingReduction = calculateReduction(
    distance * getEmissionFactor(currentFuelType),
    0
  );
  alternatives.push({
    name: 'Cycling/Walking',
    emissions: '0 kg CO₂',
    reduction: `${cyclingReduction}% reduction`
  });
  
  return alternatives;
}

// Helper function to get emission factor based on fuel type
function getEmissionFactor(fuelType: string): number {
  switch (fuelType) {
    case 'petrol':
      return 0.12;
    case 'diesel':
      return 0.11;
    case 'hybrid':
      return 0.08;
    case 'electric':
      return 0.05;
    default:
      return 0.12;
  }
}

// Calculate percentage reduction
function calculateReduction(original: number, alternative: number): number {
  return Math.round(((original - alternative) / original) * 100);
}
