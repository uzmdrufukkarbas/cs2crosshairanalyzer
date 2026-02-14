import React, { useCallback, useState } from 'react';

interface DropzoneProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onImageSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled, onImageSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center h-72 cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 scale-[1.02]' 
          : 'border-slate-300 dark:border-zinc-800 bg-white dark:bg-black hover:border-orange-400 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900/10 hover:shadow-lg dark:hover:shadow-none'}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      />
      
      <div className="pointer-events-none transform transition-transform duration-300">
        <div className={`
          w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300
          ${isDragging ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500' : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-slate-400'}
        `}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          {isDragging ? 'Drop screenshot now' : 'Upload CS2 Screenshot'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
          Drag & drop your file here, or click to browse
        </p>
      </div>
    </div>
  );
};