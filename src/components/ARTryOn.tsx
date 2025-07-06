
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ARTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
}

const ARTryOn = ({ isOpen, onClose, productName, productImage }: ARTryOnProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMode('camera');
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use AR try-on feature.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    // Clean up camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCapturedImage(null);
    setMode(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AR Try-On: {productName}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!mode && !capturedImage && (
          <div className="text-center space-y-6">
            <p className="text-gray-600 mb-6">Choose how you'd like to try on this product:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                className="flex flex-col items-center space-y-2 p-6 h-auto"
              >
                <Camera className="h-8 w-8" />
                <span>Use Camera</span>
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex flex-col items-center space-y-2 p-6 h-auto"
              >
                <Upload className="h-8 w-8" />
                <span>Upload Photo</span>
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {mode === 'camera' && !capturedImage && (
          <div className="text-center space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md rounded-lg"
            />
            <Button onClick={capturePhoto}>
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Your photo"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              {/* Overlay product image as demo - in real implementation, this would use AI */}
              <div className="absolute top-4 right-4 opacity-75">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded border-2 border-white"
                />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Here's how {productName} would look on you!
              </p>
              <p className="text-sm text-gray-500 mb-4">
                *This is a demo preview. Real AR try-on would use advanced AI to overlay the product realistically.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => {
                    setCapturedImage(null);
                    setMode(null);
                  }}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ARTryOn;
