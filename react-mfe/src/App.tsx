import React, { useState } from 'react';
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Learn Single-SPA', completed: false },
    { id: 2, text: 'Build Microfrontends', completed: false },
    { id: 3, text: 'Integrate with Angular', completed: true }
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="react-mfe-container">
      <h2>React Microfrontend</h2>
      <p>This is a React application loaded as a microfrontend</p>
      
      <div className="task-manager">
        <h3>Task Manager</h3>
        <div className="add-task">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.text}</span>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="tech-stack">
        <h4>Technologies:</h4>
        <ul>
          <li>React 18</li>
          <li>TypeScript</li>
          <li>Single-SPA React</li>
          <li>Webpack Module Federation</li>
        </ul>
      </div>
    </div>
  );
};

export default App;