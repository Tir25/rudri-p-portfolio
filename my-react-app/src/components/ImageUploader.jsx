import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ImageUploader = ({ onImageChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Compress image if needed
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxWidth / height);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check file size limit (5MB)
  const checkFileSizeLimit = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${formatFileSize(maxSize)}`);
      return false;
    }
    return true;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      
      try {
        // Check file size
        if (!checkFileSizeLimit(file)) {
          return;
        }

        // Show processing message
        toast.loading(`Processing image (${formatFileSize(file.size)})...`);

        let processedFile = file;
        
        // Compress image if it's larger than 1MB
        if (file.size > 1024 * 1024 && file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
          toast.success(`Compressed image from ${formatFileSize(file.size)} to ${formatFileSize(processedFile.size)}`);
        }

        setSelectedFile(processedFile);
        
        // Create a preview URL
        const base64 = await convertToBase64(processedFile);
        setImagePreview(base64);
        
        // Pass the base64 image to the parent component
        onImageChange({ 
          base64: base64,
          file: processedFile,
          originalSize: file.size,
          compressedSize: processedFile.size
        });
        
        toast.dismiss();
        toast.success('Image processed successfully!');
        
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Error processing image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-academic-700 mb-1">
        Cover Image
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-academic-200 border-dashed rounded-md bg-academic-50 transition-colors duration-200 hover:border-primary-300 hover:bg-academic-100">
        <div className="space-y-1 text-center">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Cover preview" 
                className="mx-auto h-48 object-cover rounded shadow-academic"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              {selectedFile && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatFileSize(selectedFile.size)}
                </div>
              )}
            </div>
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-academic-400" />
          )}
          <div className="flex text-sm text-academic-600 justify-center">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
              <span>{isProcessing ? 'Processing...' : 'Upload a file'}</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file"
                ref={fileInputRef}
                className="sr-only" 
                accept="image/*"
                onChange={handleImageChange}
                disabled={isProcessing}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-academic-500">
            PNG, JPG, GIF up to 5MB (will be compressed if needed)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;