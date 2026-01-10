/**
 * DropZone Component
 * Drag-and-drop file upload area
 */

import { memo } from 'react';
import type { DropZoneProps } from '../../types';
import { useDropZone } from '../../hooks';
import { useToast } from '../../context';

const UploadIcon = memo(() => (
  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
));
UploadIcon.displayName = 'UploadIcon';

export const DropZone = memo(function DropZone({ 
  acceptedTypes, 
  onFileSelect, 
  hint = 'Drop your file here or click to browse',
  disabled = false,
}: DropZoneProps) {
  const { error } = useToast();
  
  const {
    isDragOver,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    openFilePicker,
    validation,
  } = useDropZone({ 
    acceptedTypes, 
    onFileSelect,
  });

  // Show error toast when validation fails
  if (validation && !validation.valid && validation.error) {
    error(validation.error);
  }

  const formatAcceptedTypes = acceptedTypes
    .map(t => t.replace('image/', '.'))
    .join(', ');

  return (
    <div
      onClick={disabled ? undefined : openFilePicker}
      onDragEnter={disabled ? undefined : handleDragEnter}
      onDragOver={disabled ? undefined : handleDragOver}
      onDragLeave={disabled ? undefined : handleDragLeave}
      onDrop={disabled ? undefined : handleDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload file"
      aria-disabled={disabled}
      className={`
        border-2 border-dashed rounded-xl p-8 transition-all duration-300
        ${disabled 
          ? 'border-slate-700 bg-slate-800/30 cursor-not-allowed opacity-50' 
          : isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] cursor-pointer'
            : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50 cursor-pointer'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
          <UploadIcon />
        </div>
        
        <div className="text-center">
          <p className="text-slate-300 font-medium">{hint}</p>
          <p className="text-slate-500 text-sm mt-1">
            Accepted formats: {formatAcceptedTypes}
          </p>
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openFilePicker();
          }}
          disabled={disabled}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
});
