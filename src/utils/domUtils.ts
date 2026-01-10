/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

export interface ElementAttributes {
  className?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: string;
  accept?: string;
  disabled?: string | null;
  innerHTML?: string;
  dataset?: Record<string, string>;
  onClick?: (e: Event) => void;
  [key: string]: unknown;
}

/**
 * Creates an HTML element with attributes and children
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: ElementAttributes = {},
  children: (string | Node)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    
    if (key === 'className') {
      element.className = value as string;
    } else if (key === 'innerHTML') {
      element.innerHTML = value as string;
    } else if (key === 'dataset') {
      Object.entries(value as Record<string, string>).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
    } else {
      element.setAttribute(key, String(value));
    }
  });
  
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Queries a single element
 */
export function $<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Queries multiple elements
 */
export function $$<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Adds event listener with automatic cleanup
 */
export function addEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void
): () => void {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Escapes HTML entities
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
