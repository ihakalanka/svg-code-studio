/**
 * useKeyboardShortcuts Hook
 * Handles global keyboard shortcuts
 */

import { useEffect, useCallback } from 'react';

type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]): void {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
      const isCtrlOrMetaPressed = e.ctrlKey || e.metaKey;
      
      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        (!ctrlOrMeta || isCtrlOrMetaPressed) &&
        (!shortcut.shiftKey || e.shiftKey)
      ) {
        e.preventDefault();
        shortcut.handler();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
