import React from 'react';
import { EmissionsResult as EmissionsResultType } from '@/utils/emissions';
import { CheckCircle } from 'lucide-react';

interface EmissionsResultProps {
  result: EmissionsResultType;
  vehicleData: {
    make: string;
    model: string;
    year: number;
    fuelType: string;
    distance: number;
  };
  onNewCalculation: () => void;
  onSave: () => void;
}

const EmissionsResultComponent: React.FC<EmissionsResultProps> = ({
  result,
  vehicleData,
  onNewCalculation,
  onSave
}) => {
  return (
    <div className="mt-8 animate-in fade-in">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900">Emissions Results</h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">Based on your vehicle specifications</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            +10 points earned
          </span>
        </div>
        <div className="border-t border-neutral-200">
          <dl>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Vehicle</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2 font-semibold">
                {`${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Fuel Type</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2 capitalize">
                {vehicleData.fuelType}
              </dd>
            </div>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Distance</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                {vehicleData.distance} km
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">CO₂ Emissions</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                <div className="text-2xl font-bold text-neutral-900">{result.emissionsAmount}</div>
                <p className="text-sm text-neutral-500 mt-1">{result.relativeSaving}</p>
              </dd>
            </div>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Eco-friendly alternatives</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-neutral-200 rounded-md divide-y divide-neutral-200">
                  {result.alternatives.map((alternative, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-primary-500" />
                        <span className="ml-2 flex-1 w-0 truncate">
                          {alternative.name}: {alternative.emissions} ({alternative.reduction})
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={onNewCalculation}
          type="button" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Calculate New Route
        </button>
        <button 
          onClick={onSave}
          type="button" 
          className="ml-3 inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save to History
        </button>
      </div>
    </div>
  );
};

export default EmissionsResultComponent;
