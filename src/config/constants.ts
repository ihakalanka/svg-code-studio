/**
 * Application Constants
 */

export const APP_CONFIG = {
  name: 'SVG Code Studio',
  version: '1.0.0',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedFormats: {
    svg: ['image/svg+xml', '.svg'],
    png: ['image/png', '.png'],
    jpg: ['image/jpeg', '.jpg', '.jpeg'],
  },
} as const;

export const MESSAGES = {
  errors: {
    invalidFile: 'Invalid file type. Please upload a valid file.',
    fileTooLarge: `File size exceeds the maximum limit of ${APP_CONFIG.maxFileSize / 1024 / 1024}MB.`,
    readError: 'Failed to read the file. Please try again.',
    noFile: 'No file selected. Please upload a file first.',
    conversionFailed: 'Conversion failed. Please try again.',
    clipboardFailed: 'Failed to copy to clipboard.',
    invalidSvg: 'Invalid SVG format.',
  },
  success: {
    copied: 'Code copied to clipboard!',
    converted: 'File converted successfully!',
    downloaded: 'File downloaded successfully!',
    pasted: 'SVG code pasted successfully!',
  },
  info: {
    dropHint: 'Drop your SVG file here or click to browse',
    processing: 'Processing your file...',
  },
} as const;

export const CONVERSION_MODES = {
  SVG_TO_CODE: 'svg-to-code',
  PNG_TO_SVG: 'png-to-svg',
} as const;

export type ConversionMode = typeof CONVERSION_MODES[keyof typeof CONVERSION_MODES];

export const TOAST_DURATION = {
  short: 2000,
  default: 3000,
  long: 5000,
} as const;
