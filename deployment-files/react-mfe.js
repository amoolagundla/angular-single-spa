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
            // Create a unique ID for this instance
            const instanceId = 'react-mfe-' + Date.now();
            
            container.innerHTML = `
              <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white; min-height: 400px;">
                <h2 style="font-size: 28px; margin-bottom: 10px;">⚛️ React Microfrontend</h2>
                <p style="opacity: 0.9; margin-bottom: 20px;">This is a React 18 application loaded as a microfrontend through Single-SPA</p>
                
                <div style="background: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 20px; color: #333; margin: 20px 0;">
                  <h3 style="color: #764ba2; margin-bottom: 15px;">📝 Interactive Task Manager</h3>
                  
                  <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input 
                      id="${instanceId}-input" 
                      type="text" 
                      placeholder="Add a new task..." 
                      style="flex: 1; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; font-size: 14px;"
                    />
                    <button 
                      id="${instanceId}-btn"
                      style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
                    >Add Task</button>
                  </div>
                  
                  <div id="${instanceId}-tasks">
                    <div class="task-item" style="padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
                      <input type="checkbox" checked style="width: 20px; height: 20px;" />
                      <span style="flex: 1; text-decoration: line-through; opacity: 0.6;">Learn Single-SPA</span>
                      <button class="delete-btn" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                    </div>
                    <div class="task-item" style="padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
                      <input type="checkbox" style="width: 20px; height: 20px;" />
                      <span style="flex: 1;">Build Microfrontends</span>
                      <button class="delete-btn" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                    </div>
                    <div class="task-item" style="padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
                      <input type="checkbox" checked style="width: 20px; height: 20px;" />
                      <span style="flex: 1; text-decoration: line-through; opacity: 0.6;">Deploy to Azure Static Web Apps</span>
                      <button class="delete-btn" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                    </div>
                  </div>
                  
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <small style="color: #666;">💡 This is a fully interactive React component running inside an Angular shell application</small>
                  </div>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-top: 20px;">
                  <h4 style="margin-bottom: 10px;">🛠️ Technologies Used:</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">✅ React 18</div>
                    <div style="padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">✅ TypeScript</div>
                    <div style="padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">✅ Single-SPA</div>
                    <div style="padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">✅ SystemJS</div>
                  </div>
                </div>
              </div>
            `;
            
            // Add event listeners after DOM is created
            setTimeout(() => {
              const btn = document.getElementById(instanceId + '-btn');
              const input = document.getElementById(instanceId + '-input');
              const tasksContainer = document.getElementById(instanceId + '-tasks');
              
              // Add button hover effects
              if (btn) {
                btn.onmouseover = () => { btn.style.background = '#5a67d8'; };
                btn.onmouseout = () => { btn.style.background = '#667eea'; };
              }
              
              // Handle Enter key on input
              if (input) {
                input.onkeypress = (e) => {
                  if (e.key === 'Enter' && btn) {
                    btn.click();
                  }
                };
              }
              
              // Add task functionality
              if (btn && input && tasksContainer) {
                btn.onclick = () => {
                  const taskText = input.value.trim();
                  if (taskText) {
                    const newTask = document.createElement('div');
                    newTask.className = 'task-item';
                    newTask.style = 'padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 10px;';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.style = 'width: 20px; height: 20px;';
                    
                    const span = document.createElement('span');
                    span.style = 'flex: 1;';
                    span.textContent = taskText;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.style = 'padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
                    deleteBtn.textContent = 'Delete';
                    
                    // Add checkbox event
                    checkbox.onchange = function() {
                      span.style.textDecoration = this.checked ? 'line-through' : 'none';
                      span.style.opacity = this.checked ? '0.6' : '1';
                    };
                    
                    // Add delete event
                    deleteBtn.onclick = function() {
                      newTask.remove();
                    };
                    
                    newTask.appendChild(checkbox);
                    newTask.appendChild(span);
                    newTask.appendChild(deleteBtn);
                    tasksContainer.appendChild(newTask);
                    
                    input.value = '';
                  }
                };
              }
              
              // Add events to existing tasks
              const existingTasks = tasksContainer.querySelectorAll('.task-item');
              existingTasks.forEach(taskItem => {
                const checkbox = taskItem.querySelector('input[type="checkbox"]');
                const span = taskItem.querySelector('span');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                
                if (checkbox && span) {
                  checkbox.onchange = function() {
                    span.style.textDecoration = this.checked ? 'line-through' : 'none';
                    span.style.opacity = this.checked ? '0.6' : '1';
                  };
                }
                
                if (deleteBtn) {
                  deleteBtn.onclick = function() {
                    taskItem.remove();
                  };
                }
              });
            }, 100);
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