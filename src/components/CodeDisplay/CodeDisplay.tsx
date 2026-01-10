/**
 * CodeDisplay Component
 * Displays formatted code with actions
 */

import { memo, useState, useMemo, useCallback } from 'react';
import type { CodeDisplayProps } from '../../types';
import { useClipboard } from '../../hooks';
import { useToast } from '../../context';
import { MESSAGES } from '../../config/constants';
import { highlightSvgSyntax, formatSvgCode, minifySvgCode } from '../../services/svgService';

// Icons
const CopyIcon = memo(() => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
));
CopyIcon.displayName = 'CopyIcon';

const FormatIcon = memo(() => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
));
FormatIcon.displayName = 'FormatIcon';

const DownloadIcon = memo(() => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
));
DownloadIcon.displayName = 'DownloadIcon';

const CodePlaceholderIcon = memo(() => (
  <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
));
CodePlaceholderIcon.displayName = 'CodePlaceholderIcon';

// Empty State
const EmptyState = memo(() => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-200">SVG Code</h3>
    </div>
    <div className="text-center py-12 text-slate-500">
      <CodePlaceholderIcon />
      <p>Upload an SVG file to see the code here</p>
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton = memo(function ActionButton({ icon, label, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
});

export const CodeDisplay = memo(function CodeDisplay({ code, fileName = 'converted.svg' }: CodeDisplayProps) {
  const [isMinified, setIsMinified] = useState(false);
  const { copy, isCopying } = useClipboard();
  const { success, error } = useToast();

  const displayCode = useMemo(() => {
    if (!code) return '';
    return isMinified ? minifySvgCode(code) : formatSvgCode(code);
  }, [code, isMinified]);

  const highlightedCode = useMemo(() => 
    highlightSvgSyntax(displayCode)
  , [displayCode]);

  const handleCopy = useCallback(async () => {
    const result = await copy(code);
    if (result) {
      success(MESSAGES.success.copied);
    } else {
      error(MESSAGES.errors.clipboardFailed);
    }
  }, [code, copy, success, error]);

  const handleToggleMinify = useCallback(() => {
    setIsMinified(prev => !prev);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    success(MESSAGES.success.downloaded);
  }, [code, fileName, success]);

  if (!code) {
    return <EmptyState />;
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">SVG Code</h3>
        <div className="flex gap-2">
          <ActionButton
            icon={<CopyIcon />}
            label="Copy"
            onClick={handleCopy}
            disabled={isCopying}
          />
          <ActionButton
            icon={<FormatIcon />}
            label={isMinified ? 'Format' : 'Minify'}
            onClick={handleToggleMinify}
          />
          <ActionButton
            icon={<DownloadIcon />}
            label="Download"
            onClick={handleDownload}
          />
        </div>
      </div>
      
      <div className="relative bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <pre className="code-output p-4 overflow-auto max-h-[500px] text-slate-300">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    </div>
  );
});
