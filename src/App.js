import React, { useState, useEffect, useRef, useContext, useReducer, useMemo } from "react";
import "./index.css";

// Context for Theme
const ThemeContext = React.createContext();

// Reducer for managing tasks
const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, { text: action.payload, completed: false }];
    case "TOGGLE_TASK":
      return state.map((task, index) =>
        index === action.payload ? { ...task, completed: !task.completed } : task
      );
    case "REMOVE_TASK":
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
};

const App = () => {
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  return (
    <div className={`app ${theme}`}>
      <h2>React Hooks Task Manager</h2>
      
      <input
        ref={inputRef}
        type="text"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={() => {
        if (newTask.trim()) {
          dispatch({ type: "ADD_TASK", payload: newTask });
          setNewTask("");
        }
      }}>
        Add Task
      </button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text}
            <button onClick={() => dispatch({ type: "TOGGLE_TASK", payload: index })}>
              {task.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => dispatch({ type: "REMOVE_TASK", payload: index })}>❌</button>
          </li>
        ))}
      </ul>

      <p>Total Tasks: {tasks.length}</p>
      <p>Completed Tasks: {completedTasks}</p>

      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Main App Wrapper
export default function MainApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
