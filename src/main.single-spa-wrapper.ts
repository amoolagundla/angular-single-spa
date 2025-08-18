import 'zone.js';
import './main.single-spa';

// Import the exports from main.single-spa
const mainModule = require('./main.single-spa');

// Re-export for SystemJS
export const bootstrap = mainModule.bootstrap;
export const mount = mainModule.mount;
export const unmount = mainModule.unmount;