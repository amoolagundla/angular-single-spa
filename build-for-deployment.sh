#!/bin/bash

echo "Building Angular and React apps for production deployment..."

# Build React MFE for production
echo "Building React MFE..."
cd react-mfe
NODE_ENV=production npm run build
cd ..

# Build Angular app for production
echo "Building Angular app..."
npm run build -- --configuration production

# Copy React MFE build to Angular dist folder
echo "Copying React MFE to Angular dist..."
mkdir -p dist/angular-spa-app/react-mfe
cp -r react-mfe/dist/* dist/angular-spa-app/react-mfe/

# Copy staticwebapp.config.json to dist folder
cp staticwebapp.config.json dist/angular-spa-app/

echo "Build complete! The dist/angular-spa-app folder is ready for deployment."
echo "Deploy using: swa deploy ./dist/angular-spa-app --env production"