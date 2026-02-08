/**
 * Polyfills para simple-peer y WebRTC
 */

// Polyfill para process (requerido por simple-peer)
(window as any).process = {
  env: { DEBUG: undefined },
  version: '',
  browser: true
};

// Polyfill para Buffer (requerido por simple-peer)
(window as any).global = window;
