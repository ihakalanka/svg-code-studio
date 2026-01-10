/**
 * File Utilities
 */

import type { ValidationResult } from '../types';
import { APP_CONFIG, MESSAGES } from '../config/constants';

/**
 * Validates file type and size
 */
export function validateFile(file: File | null, acceptedTypes: readonly string[]): ValidationResult {
  if (!file) {
    return { valid: false, error: MESSAGES.errors.noFile };
  }

  const isValidType = acceptedTypes.some(
    (type) => file.type === type || file.name.toLowerCase().endsWith(type)
  );

  if (!isValidType) {
    return { valid: false, error: MESSAGES.errors.invalidFile };
  }

  if (file.size > APP_CONFIG.maxFileSize) {
    return { valid: false, error: MESSAGES.errors.fileTooLarge };
  }

  return { valid: true };
}

/**
 * Reads a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error(MESSAGES.errors.readError));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Reads a file as Data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error(MESSAGES.errors.readError));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Downloads content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

/**
 * Gets filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}
