/**
 * useClipboard Hook
 * Handles clipboard read/write operations
 */

import { useCallback, useState } from 'react';

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string | null>;
  isCopying: boolean;
  lastCopied: string | null;
}

export function useClipboard(): UseClipboardReturn {
  const [isCopying, setIsCopying] = useState(false);
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    setIsCopying(true);
    
    try {
      await navigator.clipboard.writeText(text);
      setLastCopied(text);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setLastCopied(text);
        return true;
      } catch {
        return false;
      }
    } finally {
      setIsCopying(false);
    }
  }, []);

  const paste = useCallback(async (): Promise<string | null> => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }, []);

  return { copy, paste, isCopying, lastCopied };
}
