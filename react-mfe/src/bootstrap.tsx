import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: any = null;

const mount = (el: HTMLElement) => {
  root = ReactDOM.createRoot(el);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return {
    unmount: () => {
      if (root) {
        root.unmount();
        root = null;
      }
    }
  };
};

// Support for standalone development
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.getElementById('root');
  if (devRoot) {
    mount(devRoot);
  }
}

// Export mount function for Module Federation
export { mount };
export default mount;

// Also expose globally for easier integration
declare global {
  interface Window {
    reactMfeMount: typeof mount;
  }
}

if (typeof window !== 'undefined') {
  window.reactMfeMount = mount;
}