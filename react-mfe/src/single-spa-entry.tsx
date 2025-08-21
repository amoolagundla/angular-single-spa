import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

// Create the single-spa lifecycle functions
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    console.error('React MFE Error:', err, info);
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>Error in React MFE</h3>
        <pre>{err?.message}</pre>
      </div>
    );
  },
  domElementGetter: () => {
    // Try to get the container from custom props first
    // @ts-ignore
    const customElement = window.singleSpaProps?.domElement;
    if (customElement) return customElement;
    
    // Fallback to single-spa container
    let el = document.getElementById('single-spa-react-container');
    if (!el) {
      // Try the regular container
      el = document.getElementById('react-mfe-container');
    }
    if (!el) {
      // Create container if it doesn't exist
      el = document.createElement('div');
      el.id = 'single-spa-react-container';
      document.body.appendChild(el);
    }
    return el;
  }
});

// Export the lifecycle functions for single-spa
export const { bootstrap, mount, unmount } = lifecycles;

// Also export as default for module federation
export default lifecycles;

// Also expose globally as a fallback for non-SystemJS loading
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.reactMfeSingleSpa = lifecycles;
}