/**
 * SVG Service
 * Handles SVG parsing, formatting, and validation
 */

import type { SvgMetadata, ValidationResult } from '../types';

/**
 * Formats SVG code with proper indentation
 */
export function formatSvgCode(svgCode: string): string {
  // Remove extra whitespace and normalize line endings
  let formatted = svgCode.trim().replace(/\r\n/g, '\n');
  
  // Simple XML formatting
  let indent = 0;
  const indentSize = 2;
  const lines: string[] = [];
  
  // Split by tags while preserving content
  const tokens = formatted.split(/(<[^>]+>)/g).filter(Boolean);
  
  tokens.forEach((token) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('</')) {
      // Closing tag - decrease indent first
      indent = Math.max(0, indent - indentSize);
      lines.push(' '.repeat(indent) + trimmed);
    } else if (trimmed.startsWith('<') && trimmed.endsWith('/>')) {
      // Self-closing tag - no indent change
      lines.push(' '.repeat(indent) + trimmed);
    } else if (trimmed.startsWith('<?') || trimmed.startsWith('<!')) {
      // Declaration or comment - no indent change
      lines.push(' '.repeat(indent) + trimmed);
    } else if (trimmed.startsWith('<')) {
      // Opening tag - add then increase indent
      lines.push(' '.repeat(indent) + trimmed);
      indent += indentSize;
    } else {
      // Text content
      lines.push(' '.repeat(indent) + trimmed);
    }
  });
  
  return lines.join('\n');
}

/**
 * Minifies SVG code by removing unnecessary whitespace
 */
export function minifySvgCode(svgCode: string): string {
  return svgCode
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\t/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extracts SVG attributes as an object
 */
export function extractSvgAttributes(svgCode: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  
  if (!svg) return {};
  
  const attributes: Record<string, string> = {};
  Array.from(svg.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value;
  });
  
  return attributes;
}

/**
 * Gets SVG metadata (dimensions, elements count, etc.)
 */
export function getSvgMetadata(svgCode: string): SvgMetadata {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  
  if (!svg) {
    return {
      viewBox: null,
      width: null,
      height: null,
      totalElements: 0,
      elementCounts: {},
      hasAnimations: false,
      hasFilters: false,
      hasGradients: false,
      error: 'Invalid SVG'
    };
  }
  
  const viewBox = svg.getAttribute('viewBox');
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');
  
  // Count elements
  const elements = svg.querySelectorAll('*');
  const elementCounts: Record<string, number> = {};
  elements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
  });
  
  return {
    viewBox,
    width,
    height,
    totalElements: elements.length,
    elementCounts,
    hasAnimations: svg.querySelectorAll('animate, animateTransform, animateMotion').length > 0,
    hasFilters: svg.querySelectorAll('filter').length > 0,
    hasGradients: svg.querySelectorAll('linearGradient, radialGradient').length > 0,
  };
}

/**
 * Converts SVG to Data URL
 */
export function svgToDataUrl(svgCode: string): string {
  const encoded = encodeURIComponent(svgCode);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Converts SVG to Base64 Data URL
 */
export function svgToBase64(svgCode: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgCode)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Adds syntax highlighting classes to SVG code
 */
export function highlightSvgSyntax(svgCode: string): string {
  return svgCode
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Highlight comments
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syntax-comment">$1</span>')
    // Highlight attribute values
    .replace(/="([^"]*)"/g, '="<span class="syntax-value">$1</span>"')
    // Highlight attribute names
    .replace(/\s([a-zA-Z-]+)=/g, ' <span class="syntax-attr">$1</span>=')
    // Highlight tags
    .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="syntax-tag">$1</span>');
}

/**
 * Validates if string is valid SVG
 */
export function validateSvg(content: string): ValidationResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  
  if (parserError) {
    return {
      valid: false,
      error: parserError.textContent || 'Invalid SVG format',
    };
  }
  
  const svg = doc.querySelector('svg');
  if (!svg) {
    return {
      valid: false,
      error: 'No SVG element found',
    };
  }
  
  return { valid: true };
}
