import React from 'react';
import { WasteRecognitionResult } from '@/utils/ai';
import { Recycle, Info, CheckCircle, Download, LogIn } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import { useLocation } from 'wouter';

interface WasteAnalysisResultProps {
  result: WasteRecognitionResult;
  onNewUpload: () => void;
  onSave: () => void;
}

const WasteAnalysisResult: React.FC<WasteAnalysisResultProps> = ({ 
  result, 
  onNewUpload, 
  onSave 
}) => {
  const [, setLocation] = useLocation();
  
  // Try to get user, but handle the case when auth isn't available
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.error('Error accessing auth context:', error);
  }
  
  return (
    <div className="mt-8 animate-in fade-in">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900">Waste Analysis Results</h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">Results from AI image recognition</p>
          </div>
          {isAuthenticated && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              +15 points earned
            </span>
          )}
        </div>
        <div className="border-t border-neutral-200">
          <dl>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Category</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2 font-semibold capitalize">
                {result.wasteType}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Estimated weight</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                {result.weightEstimate}
              </dd>
            </div>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Recyclability score</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-neutral-900">{result.recyclabilityScore}%</span>
                  <div className="ml-4 flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${result.recyclabilityScore}%` }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Disposal method</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-neutral-200 rounded-md divide-y divide-neutral-200">
                  {result.disposalMethod.split('. ').map((step, index) => (
                    step.trim() && (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          {index === 0 ? (
                            <Recycle className="flex-shrink-0 h-5 w-5 text-primary-500" />
                          ) : index === 1 ? (
                            <Info className="flex-shrink-0 h-5 w-5 text-primary-500" />
                          ) : (
                            <CheckCircle className="flex-shrink-0 h-5 w-5 text-primary-500" />
                          )}
                          <span className="ml-2 flex-1 w-0 truncate">
                            {step}
                          </span>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              </dd>
            </div>
            <div className="bg-neutral-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-neutral-500">Environmental impact</dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                <p>{result.environmentalImpact}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={onNewUpload}
          type="button" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Upload Another Image
        </button>
        
        {isAuthenticated ? (
          <button 
            onClick={onSave}
            type="button" 
            className="ml-3 inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Save to History
          </button>
        ) : (
          <button
            onClick={() => setLocation('/login')}
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login to Save
          </button>
        )}
      </div>
    </div>
  );
};

export default WasteAnalysisResult;
