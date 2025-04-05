import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { calculateEmissions, VehicleData, EmissionsResult } from '@/utils/emissions';
import EmissionsResultComponent from '@/components/emissions/EmissionsResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const EmissionsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'petrol',
    distance: 100
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<EmissionsResult | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'year' || name === 'distance') {
      // Parse as number
      setVehicleData({
        ...vehicleData,
        [name]: parseInt(value) || 0
      });
    } else {
      setVehicleData({
        ...vehicleData,
        [name]: value
      });
    }
  };
  
  const handleFuelTypeChange = (value: string) => {
    setVehicleData({
      ...vehicleData,
      fuelType: value as 'petrol' | 'diesel' | 'hybrid' | 'electric'
    });
  };
  
  const handleCalculate = async () => {
    if (!user) return;
    
    // Validate inputs
    if (!vehicleData.make || !vehicleData.model || !vehicleData.distance) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    try {
      const calculationResult = await calculateEmissions(vehicleData, user.id);
      setResult(calculationResult);
      
      toast({
        title: "Calculation complete",
        description: "CO₂ emissions have been calculated successfully",
      });
    } catch (error) {
      console.error('Error calculating emissions:', error);
      toast({
        title: "Calculation failed",
        description: "There was an error calculating emissions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleNewCalculation = () => {
    setResult(null);
  };
  
  const handleSave = () => {
    toast({
      title: "Calculation saved",
      description: "This calculation has been saved to your history",
    });
  };
  
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="pb-5 border-b border-neutral-200">
          <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">CO₂ Emissions Calculator</h3>
          <p className="mt-2 max-w-4xl text-sm text-neutral-500">Calculate and track your carbon footprint from transportation</p>
        </div>
        
        {!result && (
          <div className="mt-6">
            <Card className="shadow">
              <CardContent className="p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-neutral-900">Vehicle Emissions</h3>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-500">Enter your vehicle details to calculate CO₂ emissions</p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Label htmlFor="vehicle-make">Vehicle Make</Label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="vehicle-make"
                        name="make"
                        placeholder="Toyota"
                        value={vehicleData.make}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label htmlFor="vehicle-model">Vehicle Model</Label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="vehicle-model"
                        name="model"
                        placeholder="Prius"
                        value={vehicleData.model}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Label htmlFor="vehicle-year">Year</Label>
                    <div className="mt-1">
                      <Input
                        type="number"
                        id="vehicle-year"
                        name="year"
                        placeholder="2023"
                        value={vehicleData.year}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <div className="mt-1">
                      <Input
                        type="number"
                        id="distance"
                        name="distance"
                        placeholder="100"
                        value={vehicleData.distance}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Label htmlFor="fuel-type">Fuel Type</Label>
                    <div className="mt-1">
                      <Select
                        value={vehicleData.fuelType}
                        onValueChange={handleFuelTypeChange}
                      >
                        <SelectTrigger id="fuel-type">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <Button
                      type="button"
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="mt-4"
                    >
                      {isCalculating ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate Emissions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {isCalculating && (
          <div className="mt-8 text-center py-12">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-neutral-500">Calculating emissions...</p>
          </div>
        )}
        
        {result && (
          <EmissionsResultComponent
            result={result}
            vehicleData={vehicleData}
            onNewCalculation={handleNewCalculation}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default EmissionsPage;
