/**
 * Preview Component
 * Displays SVG preview with metadata
 */

import { memo, useState, useMemo } from 'react';
import type { PreviewProps } from '../../types';
import { getSvgMetadata, svgToDataUrl } from '../../services/svgService';

// Icons
const ImagePlaceholderIcon = memo(() => (
  <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
));
ImagePlaceholderIcon.displayName = 'ImagePlaceholderIcon';

const PaletteIcon = memo(() => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
));
PaletteIcon.displayName = 'PaletteIcon';

// Empty State Component
const EmptyState = memo(() => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-200">Preview</h3>
    </div>
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 flex items-center justify-center min-h-[200px]">
      <div className="text-center text-slate-500">
        <ImagePlaceholderIcon />
        <p>SVG preview will appear here</p>
      </div>
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Metadata Display Component
interface MetadataProps {
  fileName: string;
  viewBox: string | null;
  width: string | null;
  height: string | null;
  totalElements: number;
  hasAnimations: boolean;
}

const Metadata = memo(function Metadata({ fileName, viewBox, width, height, totalElements, hasAnimations }: MetadataProps) {
  const items = useMemo(() => [
    { label: 'File Name', value: fileName },
    width && { label: 'Width', value: width },
    height && { label: 'Height', value: height },
    viewBox && { label: 'ViewBox', value: viewBox },
    { label: 'Elements', value: totalElements },
    { label: 'Has Animations', value: hasAnimations ? 'Yes' : 'No' },
  ].filter(Boolean) as { label: string; value: string | number }[], [fileName, viewBox, width, height, totalElements, hasAnimations]);

  return (
    <div className="mt-4 bg-slate-900 rounded-lg p-4 border border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">File Information</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-slate-500">{label}:</span>
            <span className="text-slate-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export const Preview = memo(function Preview({ svgCode, fileName = 'image.svg' }: PreviewProps) {
  const [isLightBg, setIsLightBg] = useState(false);

  const metadata = useMemo(() => 
    svgCode ? getSvgMetadata(svgCode) : null
  , [svgCode]);

  const dataUrl = useMemo(() => 
    svgCode ? svgToDataUrl(svgCode) : ''
  , [svgCode]);

  if (!svgCode) {
    return <EmptyState />;
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">Preview</h3>
        <button
          onClick={() => setIsLightBg(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          aria-label={isLightBg ? 'Switch to dark background' : 'Switch to light background'}
        >
          <PaletteIcon />
          <span>Toggle BG</span>
        </button>
      </div>
      
      <div 
        className={`rounded-lg border border-slate-700 p-4 flex items-center justify-center min-h-[200px] overflow-hidden transition-colors ${
          isLightBg ? 'bg-white' : 'bg-slate-900'
        }`}
      >
        <img
          src={dataUrl}
          alt="SVG Preview"
          className="max-w-full max-h-[300px] object-contain"
        />
      </div>

      {metadata && !metadata.error && (
        <Metadata
          fileName={fileName}
          viewBox={metadata.viewBox}
          width={metadata.width}
          height={metadata.height}
          totalElements={metadata.totalElements}
          hasAnimations={metadata.hasAnimations}
        />
      )}
    </div>
  );
});
