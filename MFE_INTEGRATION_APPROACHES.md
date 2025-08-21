# Angular Shell with React MFE - Integration Approaches

This project demonstrates **THREE different approaches** to integrate a React Micro Frontend into an Angular shell application, all without using iframes.

## Current Implementation: Direct DOM Mounting

The current implementation uses direct DOM mounting where the React app is dynamically loaded and mounted into an Angular component.

### How it works:
1. **Angular Shell** (port 4200): Main application with tab navigation
2. **React MFE** (port 4202): Standalone React app exposed via Module Federation
3. **ReactWrapperComponent**: Angular component that dynamically loads and mounts the React app

### Key Files:
- `/src/app/react-wrapper/react-wrapper.component.ts` - Angular wrapper component
- `/react-mfe/src/bootstrap.tsx` - React bootstrap with mount function
- `/react-mfe/webpack.config.js` - Module Federation configuration

## Alternative Approaches

### 1. Module Federation (Pure)
Using Webpack 5 Module Federation to share modules between Angular and React:

```typescript
// In Angular component
const { mount } = await loadRemoteModule({
  remoteEntry: 'http://localhost:4202/remoteEntry.js',
  remoteName: 'reactMfe',
  exposedModule: './App'
});
mount(containerElement);
```

**Pros:**
- True module sharing
- Smaller bundle sizes
- Shared dependencies

**Cons:**
- Complex webpack configuration
- Version compatibility issues

### 2. Web Components
Wrapping React MFE as a Web Component:

```typescript
// Define React app as custom element
customElements.define('react-mfe-element', ReactMfeElement);

// Use in Angular template
<react-mfe-element></react-mfe-element>
```

**Pros:**
- Framework agnostic
- Better isolation (Shadow DOM)
- Native browser API

**Cons:**
- Limited styling options with Shadow DOM
- Browser compatibility considerations

### 3. SystemJS Dynamic Imports
Using SystemJS for dynamic module loading:

```javascript
System.import('http://localhost:4202/react-mfe.js')
  .then(module => {
    module.mount(containerElement);
  });
```

**Pros:**
- Runtime loading
- No build-time dependencies
- Flexible configuration

**Cons:**
- Additional SystemJS overhead
- Complex error handling

## Running the Application

### Start both applications:
```bash
# Terminal 1: Start React MFE
cd react-mfe
npm start

# Terminal 2: Start Angular Shell
npm start
```

### Access the application:
1. Navigate to http://localhost:4200
2. Click on "React MFE" tab to load the React application

## Testing

Run the integration test:
```bash
node test-integration.js
```

## Architecture Benefits

### Current Implementation Benefits:
1. **Isolation**: React and Angular run independently
2. **No Dependency Conflicts**: Each app manages its own dependencies
3. **Easy Debugging**: Clear separation of concerns
4. **Hot Reload**: Both apps support independent hot reloading
5. **Production Ready**: Can be deployed as separate applications

### When to Use Each Approach:

| Approach | Best For |
|----------|----------|
| **Direct DOM Mount** (Current) | Simple integrations, POCs, independent deployments |
| **Module Federation** | Sharing code/components, optimized bundles |
| **Web Components** | Maximum isolation, multi-framework environments |
| **SystemJS** | Legacy systems, runtime configuration needs |

## File Structure

```
angular-spa-app/
├── src/
│   └── app/
│       ├── app.component.ts         # Main Angular component with tabs
│       └── react-wrapper/           # React integration component
│           └── react-wrapper.component.ts
├── react-mfe/
│   ├── src/
│   │   ├── App.tsx                 # React application
│   │   ├── bootstrap.tsx           # Mount function for integration
│   │   └── index.tsx               # Entry point
│   └── webpack.config.js           # Module Federation config
└── test-integration.js             # Playwright integration test
```

## Troubleshooting

### React MFE not loading:
1. Ensure React app is running on port 4202
2. Check browser console for CORS errors
3. Verify `window.reactMfeMount` is available

### Build errors:
1. Clear node_modules and reinstall: `npm install`
2. Check for version conflicts in package.json
3. Ensure webpack configurations are correct

## Next Steps

1. **Production Build**: Configure production builds with proper chunking
2. **Routing Integration**: Share routing between Angular and React
3. **State Management**: Implement shared state using event bus or Redux
4. **CI/CD Pipeline**: Set up automated testing and deployment
5. **Error Boundaries**: Add proper error handling for MFE failures