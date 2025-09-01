import { useState } from 'react';
import { Camera, Upload, AlertTriangle, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onAnalyze: (imageData: string) => void;
  loading: boolean;
}

export function ImageUploader({ onAnalyze, loading }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous states
      setError(null);

      // Basic validation
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (e.g., JPG, PNG).');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Upload Plant Image
        </CardTitle>
        <CardDescription>
          Take a clear photo of the affected plant parts for best results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {selectedImage && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="max-w-full max-h-80 rounded-lg shadow-md object-contain"
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                onClick={() => setSelectedImage(null)}
                disabled={loading}
              >
                Clear Image
              </Button>
              <Button
                onClick={() => onAnalyze(selectedImage)}
                disabled={loading}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Plant
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}