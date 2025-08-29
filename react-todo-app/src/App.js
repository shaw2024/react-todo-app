import React, { useState } from "react";

export default function App() {
  // simple tab "routing" without react-router
  const [page, setPage] = useState("home");

  // todo state (only used on Home)
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (editId) {
      setTodos(todos.map(t => (t.id === editId ? { ...t, text } : t)));
      setEditId(null);
    } else {
      setTodos([...todos, { id: Date.now(), text, completed: false }]);
    }
    setText("");
  }

  function toggleTodo(id) {
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function startEdit(id, value) {
    setEditId(id);
    setText(value);
  }

  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <div>
      <header className="header">
        <nav>
          <button
            className={`link ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button
            className={`link ${page === "about" ? "active" : ""}`}
            onClick={() => setPage("about")}
          >
            About Us
          </button>
          <button
            className={`link ${page === "contact" ? "active" : ""}`}
            onClick={() => setPage("contact")}
          >
            Contact Us
          </button>
        </nav>
      </header>

      <main>
        {page === "home" && (
          <>
            <h2>Todo List</h2>
            <form className="form" onSubmit={addTodo}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter todo..."
              />
              <button type="submit">{editId ? "Update" : "Add"}</button>
            </form>

            <ul className="todos">
              {todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? "done" : ""}>
                  <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                  <div>
                    <button onClick={() => startEdit(todo.id, todo.text)}>✏️</button>
                    <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {page === "about" && (
          <section className="page">
            <h2>About Us</h2>
            <p>
              This tiny React app shows a simple todo list with add, edit, delete,
              and complete. Tabs above switch views without any extra libraries.
            </p>
          </section>
        )}

        {page === "contact" && (
          <section className="page">
            <h2>Contact Us</h2>
            <form className="form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="4" required />
              <button type="submit">Send</button>
            </form>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 My Todo App</p>
      </footer>
    </div>
  );
}
