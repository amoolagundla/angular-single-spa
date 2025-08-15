import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    console.error('React MFE Error:', err, info, props);
    return <div>Error loading React MFE</div>;
  }
});

export const { bootstrap, mount, unmount, update } = lifecycles;
export default lifecycles;