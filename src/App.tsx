/**
 * SVG Code Studio - App Component
 * Main application component using custom hooks
 */

import { useCallback, useEffect } from 'react';
import { Header, Footer, DropZone, CodeDisplay, Preview } from './components';
import { AdUnit } from './components/AdUnit';
import { useSvgProcessor, useKeyboardShortcuts, useClipboard } from './hooks';
import { useToast } from './context';
import { validateSvg } from './services';
import { APP_CONFIG, MESSAGES, CONVERSION_MODES } from './config/constants';

export function App() {
  const { state, processFile, processPastedCode, clear } = useSvgProcessor();
  const { paste } = useClipboard();
  const { success, error, info } = useToast();

  // Handle file selection from DropZone
  const handleFileSelect = useCallback(async (file: File) => {
    info(MESSAGES.info.processing);
    
    const result = await processFile(file);
    if (result) {
      success(MESSAGES.success.converted);
    } else {
      error(MESSAGES.errors.invalidSvg);
    }
  }, [processFile, success, error, info]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    const text = await paste();
    if (!text) return;

    const validation = validateSvg(text);
    if (validation.valid) {
      processPastedCode(text);
      success(MESSAGES.success.pasted);
    }
  }, [paste, processPastedCode, success]);

  // Handle tab change
  const handleTabChange = useCallback((_tabId: string) => {
    clear();
  }, [clear]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'v', ctrlKey: true, handler: handlePaste },
  ]);

  // Prevent default drag behavior on body
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    events.forEach(event => document.body.addEventListener(event, preventDefault));
    
    return () => {
      events.forEach(event => document.body.removeEventListener(event, preventDefault));
    };
  }, []);

  // Log initialization
  useEffect(() => {
    console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized`);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>
      
      <Header 
        activeTab={CONVERSION_MODES.SVG_TO_CODE} 
        onTabChange={handleTabChange} 
      />

      {/* Ad Unit - Below Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdUnit adSlot="6615639453" className="rounded-lg overflow-hidden" />
      </div>
      
      <main id="main-content" className="flex-1 py-8" role="main">
        <div className="max-w-7xl mx-auto px-4">
          {/* SEO-friendly heading - visually hidden but accessible */}
          <h2 className="sr-only">SVG to Code Converter Tool</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <section aria-label="Upload area" className="space-y-6">
              <DropZone
                acceptedTypes={APP_CONFIG.supportedFormats.svg}
                onFileSelect={handleFileSelect}
                hint={MESSAGES.info.dropHint}
                disabled={state.isProcessing}
              />
              <Preview 
                svgCode={state.svgCode} 
                fileName={state.currentFile?.name} 
              />
            </section>
            <section aria-label="Code output">
              <CodeDisplay 
                code={state.svgCode}
                fileName={state.currentFile?.name}
              />
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
