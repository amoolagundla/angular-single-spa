// Use global single-spa since it's loaded via CDN
declare const singleSpa: any;

interface LifeCycles {
  bootstrap: () => Promise<void>;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
}

// Store for managing app states
const appStates = {
  reactMfe: {
    loaded: false,
    mounted: false,
    shouldMount: false
  }
};

// Custom activity function for React MFE (not route-based)
function reactActivityFunction() {
  // Return true when the app should be mounted
  return appStates.reactMfe.shouldMount;
}

// Register React MFE
export function registerReactMfe() {
  console.log('Registering React MFE with Single-SPA...');
  if (typeof singleSpa !== 'undefined') {
    singleSpa.registerApplication({
      name: '@react-mfe/app',
      app: () => loadReactAppDirectly(), // Use direct loading
      activeWhen: reactActivityFunction,
      customProps: {
        domElement: document.getElementById('single-spa-react-container')
      }
    });
    console.log('React MFE registered');
  } else {
    console.error('Single-SPA not available!');
  }
}

// Load React app dynamically
async function loadReactApp(): Promise<LifeCycles> {
  try {
    // Check if System is available
    // @ts-ignore
    if (!window.System) {
      console.error('SystemJS not available, attempting direct import...');
      // Try to load directly via script tag as fallback
      return await loadReactAppDirectly();
    }
    
    // @ts-ignore
    const module = await window.System.import('http://localhost:4202/react-single-spa.js');
    console.log('React MFE module loaded:', module);
    return module;
  } catch (error) {
    console.error('Failed to load React MFE via SystemJS:', error);
    // Try direct loading as fallback
    return await loadReactAppDirectly();
  }
}

// Fallback: Load React app directly without SystemJS
async function loadReactAppDirectly(): Promise<LifeCycles> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'http://localhost:4202/react-single-spa.js';
    script.type = 'text/javascript';
    
    script.onload = () => {
      // The React app should expose its lifecycle functions globally
      // @ts-ignore
      if (window.reactMfeSingleSpa) {
        // @ts-ignore
        resolve(window.reactMfeSingleSpa);
      } else {
        reject(new Error('React MFE lifecycle not found'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load React MFE script'));
    };
    
    document.head.appendChild(script);
  });
}

// Manual mount/unmount functions to be called from Angular
export function mountReactApp() {
  console.log('Setting React MFE to mount...');
  appStates.reactMfe.shouldMount = true;
  // Trigger single-spa to re-evaluate
  // @ts-ignore
  if (window.singleSpa) {
    // @ts-ignore
    window.singleSpa.triggerAppChange();
  }
}

export function unmountReactApp() {
  console.log('Setting React MFE to unmount...');
  appStates.reactMfe.shouldMount = false;
  // Trigger single-spa to re-evaluate
  // @ts-ignore
  if (window.singleSpa) {
    // @ts-ignore
    window.singleSpa.triggerAppChange();
  }
}

// Initialize single-spa
export function initializeSingleSpa() {
  // Start single-spa
  if (typeof singleSpa !== 'undefined') {
    singleSpa.start({
      urlRerouteOnly: false // Allow manual mounting/unmounting
    });
    console.log('Single-SPA started');
  } else {
    console.error('Single-SPA not available for initialization!');
  }
}

// Check if React app is mounted
export function isReactAppMounted(): boolean {
  return appStates.reactMfe.mounted;
}

// Listen for mount/unmount events
window.addEventListener('single-spa:app-change', (evt: any) => {
  evt.detail.appsByNewStatus.MOUNTED.forEach((app: any) => {
    if (app === '@react-mfe/app') {
      appStates.reactMfe.mounted = true;
    }
  });
  
  evt.detail.appsByNewStatus.NOT_MOUNTED.forEach((app: any) => {
    if (app === '@react-mfe/app') {
      appStates.reactMfe.mounted = false;
    }
  });
});