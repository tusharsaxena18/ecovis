import React, { useState, useRef } from 'react';
import { useAuth } from '@/utils/auth';
import WasteAnalysisResult from '@/components/waste/WasteAnalysisResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Upload, Camera, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeWasteImage, WasteRecognitionResult } from '@/utils/ai';

const WasteRecognitionPage: React.FC = () => {
  // Try to get user, but handle the case when auth isn't available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log('User not authenticated, continuing in demo mode');
  }
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WasteRecognitionResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, GIF)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Analyze the image
    setIsAnalyzing(true);
    try {
      // Pass user ID if available, otherwise just analyze without saving to history
      const analysisResult = await analyzeWasteImage(file, user?.id);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (user) {
      toast({
        title: "Saved to history",
        description: "This waste recognition has been saved to your history.",
      });
    } else {
      toast({
        title: "Login required",
        description: "Please log in to save this analysis to your history.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="pb-5 border-b border-neutral-200">
          <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Waste Recognition</h3>
          <p className="mt-2 max-w-4xl text-sm text-neutral-500">Upload an image of waste to get proper disposal guidance</p>
        </div>
        
        {!result && !isAnalyzing && (
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'
                } border-dashed rounded-md`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mt-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded"
                      />
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                  
                  {previewUrl && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setIsAnalyzing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Analyze Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="mt-8 text-center py-12">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-neutral-500">Analyzing your waste image...</p>
          </div>
        )}
        
        {result && (
          <WasteAnalysisResult 
            result={result} 
            onNewUpload={handleNewUpload}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default WasteRecognitionPage;
