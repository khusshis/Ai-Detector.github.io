import React, { useRef, useState } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedImage: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, selectedImage, onClear, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    // Limit size to 500MB
    if (file.size > 500 * 1024 * 1024) {
      alert('File size too large. Please keep it under 500MB.');
      return;
    }
    onFileSelect(file);
  };

  const triggerSelect = () => {
    inputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="w-full relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
        <img 
          src={selectedImage} 
          alt="To analyze" 
          className="w-full h-auto max-h-[500px] object-contain bg-black/50 backdrop-blur-sm"
        />
        {!isAnalyzing && (
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
          >
            <X size={20} />
          </button>
        )}
        {isAnalyzing && (
           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-primary/30 border-t-accent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 border-4 border-white/10 border-b-secondary rounded-full animate-spin-slow"></div>
               </div>
             </div>
             <p className="mt-4 text-cyan-300 font-mono animate-pulse">Scanning Neural Patterns...</p>
           </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={triggerSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-accent bg-accent/10 scale-[1.02]' 
          : 'border-white/20 hover:border-primary/50 hover:bg-white/5 bg-white/[0.02]'
        }
      `}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept="image/*"
      />
      
      <div className={`p-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-4 shadow-lg ${isDragging ? 'animate-bounce' : ''}`}>
        <Upload className="text-primary" size={40} />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Upload Image to Analyze
      </h3>
      <p className="text-gray-400 text-center max-w-md px-4">
        Drag & drop or click to browse. Supports JPG, PNG, WEBP.
      </p>
      
      <div className="mt-6 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><FileImage size={14}/> Max 500MB</span>
        <span className="flex items-center gap-1"><FileImage size={14}/> Secure Scan</span>
      </div>
    </div>
  );
};

export default UploadZone;