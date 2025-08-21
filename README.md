 https://jolly-wave-0ac63d010-preview.centralus.1.azurestaticapps.net

 https://jolly-wave-0ac63d010-preview.centralus.1.azurestaticapps.net/

# Angular Single-SPA Application with React Microfrontend

This project demonstrates a microfrontend architecture using Single-SPA framework with an Angular shell application and a React microfrontend.

## Project Structure

```
angular-spa-app/
├── src/                    # Angular shell application
│   ├── app/               # Angular components
│   ├── main.ts            # Standard Angular bootstrap
│   └── main.single-spa.ts # Single-SPA Angular bootstrap
├── react-mfe/             # React microfrontend
│   ├── src/              # React components
│   └── webpack.config.js # Webpack configuration for React MFE
├── index.html            # Root Single-SPA configuration
├── angular.json          # Angular configuration
└── package.json          # Dependencies and scripts
```

## Features

- **Angular Shell Application (v19)**: Main container application built with Angular 19
- **React Microfrontend (v18)**: Independent React application loaded as a microfrontend
- **Single-SPA Integration**: Orchestrates multiple frameworks in a single application
- **Routing**: Seamless navigation between Angular and React sections
- **Task Manager**: Demo React component with state management

## Installation

Install dependencies for both applications:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install Angular dependencies
npm install

# Install React MFE dependencies
cd react-mfe
npm install
cd ..
```

## Running the Application

### Option 1: Run all applications together (Recommended)

```bash
npm run start:all
```

This will start:
- Angular app on http://localhost:4200
- React MFE on http://localhost:4201
- Root config on http://localhost:3000

Open http://localhost:3000 to see the full microfrontend application.

### Option 2: Run applications separately

Terminal 1 - Angular Shell:
```bash
npm run start:angular
```

Terminal 2 - React MFE:
```bash
npm run start:react
```

Terminal 3 - Root Config:
```bash
npm run serve:root
```

## Building for Production

```bash
npm run build:all
```

This will build both the Angular shell and React microfrontend.

## Navigation

- **Home**: Default Angular route
- **Angular App**: Angular-specific components
- **React MFE**: React microfrontend with task manager

## Technologies Used

### Angular Shell
- Angular 19
- TypeScript
- RxJS
- Single-SPA Angular

### React Microfrontend
- React 18
- TypeScript
- Webpack 5
- Single-SPA React

### Orchestration
- Single-SPA
- SystemJS for module loading
- Webpack Module Federation concepts

## Architecture Benefits

1. **Technology Agnostic**: Mix different frameworks in the same application
2. **Independent Deployment**: Each microfrontend can be deployed separately
3. **Team Autonomy**: Different teams can work on different parts
4. **Incremental Updates**: Migrate or update parts of the application independently
5. **Fault Isolation**: Issues in one microfrontend don't crash the entire application

## Development Tips

- Each microfrontend runs on its own port during development
- CORS headers are configured for cross-origin communication
- The root HTML file orchestrates the loading of microfrontends
- SystemJS handles dynamic module loading

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed: `npm run install:all`
2. Check that ports 3000, 4200, and 4201 are available
3. Clear browser cache if routing seems broken
4. Check browser console for module loading errors
5. Verify SystemJS import map URLs in index.html
