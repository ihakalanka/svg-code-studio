/**
 * SVG Code Studio - Main Application
 * 
 * A web application for converting SVG files to code
 * Built with Vite + React + TypeScript + Tailwind CSS
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { App } from './App';
import { ToastProvider } from './context';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
