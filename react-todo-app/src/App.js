import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // simple tab "routing" without react-router
  const [page, setPage] = useState("home");

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  // todo state with more features
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("personal");
  const [notification, setNotification] = useState(null);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [darkMode]);

  // Show notification
  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (editId) {
      setTodos(todos.map(t => (t.id === editId ? { ...t, text, priority, dueDate, category } : t)));
      setEditId(null);
      showNotification("Todo updated successfully! ✅");
    } else {
      setTodos([...todos, { 
        id: Date.now(), 
        text, 
        completed: false,
        priority,
        dueDate,
        category,
        createdAt: new Date().toISOString()
      }]);
      showNotification("Todo added successfully! 🎉");
    }
    setText("");
    setPriority("medium");
    setDueDate("");
    setCategory("personal");
  }

  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    showNotification(todo.completed ? "Todo marked as incomplete" : "Todo completed! 🎊", "info");
  }

  function startEdit(id, todo) {
    setEditId(id);
    setText(todo.text);
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate || "");
    setCategory(todo.category || "personal");
  }

  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
    showNotification("Todo deleted", "error");
  }

  function clearCompleted() {
    setTodos(todos.filter(t => !t.completed));
    showNotification("Completed todos cleared");
  }

  // Filter and search todos
  const filteredTodos = todos
    .filter(todo => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter(todo => 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.category && todo.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === "high" && !t.completed).length
  };

  return (
    <div className="app-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="header">
        <nav>
          <button
            className={`link ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            📝 Home
          </button>
          <button
            className={`link ${page === "about" ? "active" : ""}`}
            onClick={() => setPage("about")}
          >
            ℹ️ About
          </button>
          <button
            className={`link ${page === "contact" ? "active" : ""}`}
            onClick={() => setPage("contact")}
          >
            📧 Contact
          </button>
        </nav>
        <button 
          className="dark-mode-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span>{darkMode ? "☀️" : "🌙"}</span>
        </button>
      </header>

      <main>
        {page === "home" && (
          <div className="home-page">
            <div className="page-header">
              <h1 className="main-title">✨ My Todo List</h1>
              <p className="subtitle">Stay organized and productive</p>
            </div>

            {/* Statistics Dashboard */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card active">
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card priority">
                <div className="stat-value">{stats.highPriority}</div>
                <div className="stat-label">High Priority</div>
              </div>
            </div>

            {/* Add Todo Form */}
            <form className="todo-form" onSubmit={addTodo}>
              <div className="form-row">
                <input
                  className="todo-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              <div className="form-row">
                <select 
                  className="select-input"
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <select 
                  className="select-input"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">❤️ Health</option>
                  <option value="other">📌 Other</option>
                </select>
                <input
                  className="date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Due Date"
                />
              </div>
              <button type="submit" className="submit-button">
                {editId ? "✏️ Update Todo" : "➕ Add Todo"}
              </button>
            </form>

            {/* Search and Filter */}
            <div className="controls">
              <input
                className="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search todos..."
              />
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All ({todos.length})
                </button>
                <button 
                  className={`filter-btn ${filter === "active" ? "active" : ""}`}
                  onClick={() => setFilter("active")}
                >
                  Active ({stats.active})
                </button>
                <button 
                  className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed ({stats.completed})
                </button>
              </div>
              {stats.completed > 0 && (
                <button className="clear-btn" onClick={clearCompleted}>
                  🗑️ Clear Completed
                </button>
              )}
            </div>

            {/* Todo List */}
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {searchQuery ? "🔍" : todos.length === 0 ? "📝" : "✅"}
                </div>
                <h3>{searchQuery ? "No todos found" : todos.length === 0 ? "No todos yet" : "All done!"}</h3>
                <p>
                  {searchQuery 
                    ? "Try adjusting your search" 
                    : todos.length === 0 
                    ? "Add your first todo to get started" 
                    : "Great job completing your tasks!"}
                </p>
              </div>
            ) : (
              <ul className="todos">
                {filteredTodos.map((todo) => (
                  <li 
                    key={todo.id} 
                    className={`todo-item ${todo.completed ? "completed" : ""} priority-${todo.priority}`}
                  >
                    <div className="todo-checkbox">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        id={`todo-${todo.id}`}
                      />
                      <label htmlFor={`todo-${todo.id}`}></label>
                    </div>
                    <div className="todo-content">
                      <div className="todo-text">{todo.text}</div>
                      <div className="todo-meta">
                        <span className={`priority-badge ${todo.priority}`}>
                          {todo.priority === "high" ? "🔴" : todo.priority === "medium" ? "🟡" : "🟢"} 
                          {todo.priority}
                        </span>
                        <span className="category-badge">
                          {todo.category === "work" ? "💼" : 
                           todo.category === "shopping" ? "🛒" : 
                           todo.category === "health" ? "❤️" : 
                           todo.category === "other" ? "📌" : "👤"} 
                          {todo.category}
                        </span>
                        {todo.dueDate && (
                          <span className="due-date">
                            📅 {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => startEdit(todo.id, todo)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteTodo(todo.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {page === "about" && (
          <div className="content-page">
            <div className="page-header">
              <h1>ℹ️ About Us</h1>
            </div>
            <div className="card">
              <h3>✨ Feature-Rich Todo App</h3>
              <p>
                This modern React todo app helps you stay organized with powerful features:
              </p>
              <ul className="feature-list">
                <li>✅ Add, edit, and delete todos</li>
                <li>🎨 Beautiful, modern UI with dark mode</li>
                <li>🔍 Search and filter functionality</li>
                <li>🎯 Priority levels (Low, Medium, High)</li>
                <li>📅 Due date tracking</li>
                <li>📁 Categories (Personal, Work, Shopping, Health, Other)</li>
                <li>📊 Statistics dashboard</li>
                <li>💾 Local storage persistence</li>
                <li>🔔 Toast notifications</li>
                <li>📱 Fully responsive design</li>
              </ul>
              <div className="tech-stack">
                <h4>Built with:</h4>
                <div className="tech-badges">
                  <span className="tech-badge">⚛️ React</span>
                  <span className="tech-badge">🎨 CSS3</span>
                  <span className="tech-badge">🔧 React Hooks</span>
                  <span className="tech-badge">💾 Local Storage</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "contact" && (
          <div className="content-page">
            <div className="page-header">
              <h1>📧 Contact Us</h1>
              <p>We'd love to hear from you!</p>
            </div>
            <div className="card">
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                showNotification("Message sent successfully! We'll get back to you soon. 📧");
                e.target.reset();
              }}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    id="name"
                    type="text" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    id="subject"
                    type="text" 
                    placeholder="How can we help?" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message"
                    placeholder="Tell us what's on your mind..." 
                    rows="6" 
                    required 
                  />
                </div>
                <button type="submit" className="submit-button">
                  📨 Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 My Todo App | Made with ❤️ and React</p>
      </footer>
    </div>
  );
}
