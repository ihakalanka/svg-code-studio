/**
 * Shared Type Definitions
 */

// SVG Related Types
export interface SvgMetadata {
  viewBox: string | null;
  width: string | null;
  height: string | null;
  totalElements: number;
  elementCounts: Record<string, number>;
  hasAnimations: boolean;
  hasFilters: boolean;
  hasGradients: boolean;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// App State Types
export interface FileInfo {
  name: string;
}

export interface AppState {
  currentFile: FileInfo | null;
  svgCode: string;
  isProcessing: boolean;
}

// Component Props Types
export interface DropZoneProps {
  acceptedTypes: readonly string[];
  onFileSelect: (file: File) => void;
  hint?: string;
  disabled?: boolean;
}

export interface CodeDisplayProps {
  code: string;
  fileName?: string;
}

export interface PreviewProps {
  svgCode: string;
  fileName?: string;
}

export interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  duration?: number;
}
