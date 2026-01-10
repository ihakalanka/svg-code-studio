/**
 * useSvgProcessor Hook
 * Handles SVG file processing and validation
 */

import { useState, useCallback } from 'react';
import type { AppState } from '../types';
import { validateSvg } from '../services/svgService';
import { readFileAsText } from '../utils/fileUtils';

interface UseSvgProcessorReturn {
  state: AppState;
  processFile: (file: File) => Promise<boolean>;
  processPastedCode: (code: string) => boolean;
  clear: () => void;
}

const initialState: AppState = {
  currentFile: null,
  svgCode: '',
  isProcessing: false,
};

export function useSvgProcessor(): UseSvgProcessorReturn {
  const [state, setState] = useState<AppState>(initialState);

  const processFile = useCallback(async (file: File): Promise<boolean> => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const code = await readFileAsText(file);
      const validation = validateSvg(code);
      
      if (!validation.valid) {
        setState(prev => ({ ...prev, isProcessing: false }));
        return false;
      }
      
      setState({
        currentFile: { name: file.name },
        svgCode: code,
        isProcessing: false,
      });
      
      return true;
    } catch {
      setState(prev => ({ ...prev, isProcessing: false }));
      return false;
    }
  }, []);

  const processPastedCode = useCallback((code: string): boolean => {
    const validation = validateSvg(code);
    
    if (!validation.valid) {
      return false;
    }
    
    setState({
      currentFile: { name: 'pasted.svg' },
      svgCode: code,
      isProcessing: false,
    });
    
    return true;
  }, []);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, processFile, processPastedCode, clear };
}
