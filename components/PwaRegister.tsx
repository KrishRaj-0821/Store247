'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('Service Worker registration failed: ', err);
        });
      });
    } else if ('serviceWorker' in navigator && window.location.hostname === 'localhost') {
        // Register SW in localhost development as well
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
              console.error('Service Worker registration failed: ', err);
            });
          });
    }
  }, []);

  return null;
}
