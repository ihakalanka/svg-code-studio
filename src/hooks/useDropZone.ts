/**
 * useDropZone Hook
 * Handles drag-and-drop file upload logic
 */

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from 'react';
import type { ValidationResult } from '../types';
import { validateFile } from '../utils/fileUtils';

interface UseDropZoneOptions {
  acceptedTypes: readonly string[];
  onFileSelect: (file: File) => void;
}

interface UseDropZoneReturn {
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDragEnter: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFilePicker: () => void;
  validation: ValidationResult | null;
}

export function useDropZone({ acceptedTypes, onFileSelect }: UseDropZoneOptions): UseDropZoneReturn {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback((file: File) => {
    const result = validateFile(file, acceptedTypes);
    setValidation(result);
    
    if (result.valid) {
      onFileSelect(file);
    }
    
    return result;
  }, [acceptedTypes, onFileSelect]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [processFile]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    isDragOver,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    openFilePicker,
    validation,
  };
}
