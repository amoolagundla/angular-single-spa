# Angular Single-SPA Project

## Project Overview
This is a microfrontend architecture project using Single-SPA framework with Angular as the root application and React as a microfrontend module.

### Architecture
- **Root Application**: Angular app serving as the single-spa orchestrator (port 3000)
- **Angular MFE**: Main Angular application (port 4200)
- **React MFE**: React microfrontend module (port 4202)

## Development Commands

### Quick Start
```bash
npm run install:all  # Install all dependencies
npm run start:all    # Start all applications
```

### Individual Commands
- `npm start` - Start Angular dev server
- `npm run start:react` - Start React MFE
- `npm run serve:root` - Serve root application
- `npm run build:all` - Build all applications

## Visual Development

### Design Principles
- **Simplicity & Clarity**: Clean, uncluttered interface with clear navigation
- **Consistency**: Uniform design language across all microfrontends
- **Performance**: Fast load times and responsive interactions
- **Accessibility**: WCAG AA+ compliance for all components
- **Responsive Design**: Mobile-first approach with graceful scaling

### Design System
- **Colors**: 
  - Primary: Angular red (#dd0031)
  - React blue (#61dafb)
  - Neutrals: Gray scale for text and borders
  - Semantic: Success (green), Error (red), Warning (amber), Info (blue)
- **Typography**: 
  - Font: Inter, system-ui fallback
  - Scale: H1 (32px), H2 (24px), Body (16px), Small (14px)
- **Spacing**: 8px base unit system (8, 16, 24, 32, 48px)
- **Border Radius**: Small (4px), Medium (8px), Large (12px)

### Quick Visual Check
After implementing any front-end change:
1. **Identify changes** - Review modified components
2. **Test locally** - Navigate to http://localhost:3000
3. **Verify design** - Check consistency with design system
4. **Test responsiveness** - Check mobile, tablet, desktop views
5. **Validate accessibility** - Test keyboard navigation and screen readers

## Testing & Quality

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript is configured with strict mode. Ensure all types are properly defined.

## Deployment

### Azure Static Web Apps
```bash
npm run build:all
npm run prepare:deploy
npm run deploy:swa
```

Configuration is in `staticwebapp.config.json` with SPA routing support.

## Project Structure
```
/
├── src/                    # Angular root application
│   ├── app/               # Angular components
│   └── single-spa-config.ts # Single-SPA configuration
├── react-mfe/             # React microfrontend
│   ├── src/              # React components
│   └── webpack.config.js # Webpack configuration
├── dist/                  # Build output
└── deployment-files/      # SWA deployment files
```

## Important Notes
- TypeScript version locked at 5.6.3 for Angular 19 compatibility
- Use `--legacy-peer-deps` flag when installing packages
- All microfrontends must export proper lifecycle methods for single-spa

## Troubleshooting

### Port Already in Use
Kill all Node processes:
```bash
lsof -i :3000,4200,4202 -t | xargs -r kill -9
```

### TypeScript Version Conflicts
Ensure TypeScript version is 5.6.3 in package.json

### Module Federation Issues
Check webpack.config.js for proper SystemJS exports