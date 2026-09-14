import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Auto-clear cookies and browser cache after every new deployment
const checkAndClearDeploymentCache = () => {
  try {
    const currentBuild = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : 'dev';
    const lastBuild = localStorage.getItem('library_portal_build_time');

    if (lastBuild && lastBuild !== currentBuild) {
      console.log(`[Deployment Sync] New build detected (${currentBuild}). Clearing cookies and cache data...`);

      // 1. Clear all cookies across all domain paths
      document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
        }
      });

      // 2. Clear sessionStorage
      sessionStorage.clear();

      // 3. Clear CacheStorage API if available
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
    }

    localStorage.setItem('library_portal_build_time', currentBuild);
  } catch (err) {
    console.warn('[Deployment Sync] Cache clear error:', err);
  }
};

checkAndClearDeploymentCache();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

