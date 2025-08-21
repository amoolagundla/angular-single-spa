# Angular Shell with React MFE - Run Instructions

## Architecture Overview
This project demonstrates an Angular shell application with tabs that loads a React micro frontend in the second tab.

- **Angular Shell**: Main application running on port 4200
- **React MFE**: Micro frontend application running on port 4202

## How to Run

### Option 1: Using the start script
```bash
./start-mfe.sh
```

### Option 2: Manual start

1. Start the React MFE (in one terminal):
```bash
cd react-mfe
npm start
```

2. Start the Angular Shell (in another terminal):
```bash
npm start
```

## Accessing the Application

1. Open your browser and navigate to: http://localhost:4200
2. You'll see the Angular shell with two tabs:
   - **Angular Content**: Shows the main Angular application content
   - **React MFE**: Loads the React micro frontend in an iframe

## Features

- Tab-based navigation
- Angular 19 shell application
- React 18 micro frontend
- Dynamic loading of React MFE when tab is selected
- Iframe-based integration for simplicity and isolation

## Ports

- Angular Shell: http://localhost:4200
- React MFE: http://localhost:4202

## Notes

- The React MFE is loaded in an iframe for isolation and simplicity
- The React app is only loaded when the "React MFE" tab is clicked for the first time
- Both applications must be running for the integration to work properly