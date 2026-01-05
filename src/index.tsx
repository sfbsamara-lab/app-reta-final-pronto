import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("ERRO CRÍTICO: Elemento 'root' não encontrado no HTML.");
}

// --- Service Worker Registration (for cache clearing & forcing icon updates) ---
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      // If there is a waiting worker, tell it to skip waiting
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // When a new service worker is found, request it to skip waiting as soon as installed
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });

      // When the controller changes (new SW took over), reload to get new assets
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Ask the browser to check for updates immediately
      registration.update().catch(() => {});
    } catch (e) {
      console.warn('[SW] registration failed:', e);
    }
  });
}