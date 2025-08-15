import { registerApplication, start } from 'single-spa';
import { constructApplications, constructRoutes, constructLayoutEngine } from 'single-spa-layout';

const routes = constructRoutes({
  routes: [
    {
      type: 'route',
      path: 'angular',
      routes: [
        {
          type: 'application',
          name: '@angular-spa/shell'
        }
      ]
    },
    {
      type: 'route',
      path: 'react',
      routes: [
        {
          type: 'application',
          name: '@react-mfe/app'
        }
      ]
    },
    {
      type: 'route',
      default: true,
      routes: [
        {
          type: 'application',
          name: '@angular-spa/shell'
        }
      ]
    }
  ]
});

const applications = constructApplications({
  routes,
  loadApp: ({ name }) => {
    if (name === '@angular-spa/shell') {
      return System.import('@angular-spa/shell');
    } else if (name === '@react-mfe/app') {
      return System.import('@react-mfe/app');
    }
    return Promise.reject(new Error(`Unknown app: ${name}`));
  }
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications
});

applications.forEach(registerApplication);
layoutEngine.activate();
start();