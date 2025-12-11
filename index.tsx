import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './src/index.css'; // Garanta que esta linha existe

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("ERRO CRÍTICO: Elemento 'root' não encontrado no HTML.");
}