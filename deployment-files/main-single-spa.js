System.register([], function(exports) {
  'use strict';
  return {
    execute: function() {
      const lifecycles = {
        bootstrap: () => {
          return Promise.resolve();
        },
        mount: (props) => {
          const container = document.getElementById('single-spa-application');
          if (container) {
            container.innerHTML = `
              <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="color: #333;">Angular Single-SPA Application</h1>
                <nav style="margin: 20px 0; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
                  <a href="/" style="margin: 0 10px; text-decoration: none; color: #333;">Home</a> |
                  <a href="/angular" style="margin: 0 10px; text-decoration: none; color: #333;">Angular App</a> |
                  <a href="/react" style="margin: 0 10px; text-decoration: none; color: #333;">React MFE</a>
                </nav>
                
                <div id="content" style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                  ${location.pathname.startsWith('/angular') ? `
                    <div class="angular-content">
                      <h2 style="color: #0066cc;">Angular Component</h2>
                      <p>This is a native Angular component within the shell application.</p>
                      <ul>
                        <li>Built with Angular 19</li>
                        <li>Using standalone components</li>
                        <li>Ready for Single-SPA integration</li>
                      </ul>
                      <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 4px;">
                        <strong>Framework:</strong> Angular 19.0.0<br>
                        <strong>Architecture:</strong> Microfrontend with Single-SPA<br>
                        <strong>Deployment:</strong> Azure Static Web Apps
                      </div>
                    </div>
                  ` : `
                    <div class="home">
                      <h2 style="color: #333;">Welcome to Angular Single-SPA Application</h2>
                      <p>This is the main Angular shell application that hosts microfrontends.</p>
                      <p>Navigate using the menu above to see different parts of the application.</p>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                        <div style="padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <h3 style="color: #0066cc;">🅰️ Angular Shell</h3>
                          <p>The main container application built with Angular 19 that orchestrates the microfrontends.</p>
                        </div>
                        <div style="padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <h3 style="color: #61dafb;">⚛️ React MFE</h3>
                          <p>A React 18 microfrontend with an interactive task manager demonstration.</p>
                        </div>
                      </div>
                    </div>
                  `}
                </div>
              </div>
            `;
          }
          return Promise.resolve();
        },
        unmount: () => {
          const container = document.getElementById('single-spa-application');
          if (container) {
            container.innerHTML = '';
          }
          return Promise.resolve();
        }
      };

      exports({
        bootstrap: lifecycles.bootstrap,
        mount: lifecycles.mount,
        unmount: lifecycles.unmount
      });
    }
  };
});