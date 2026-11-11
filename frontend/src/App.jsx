import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const API = 'http://localhost:3001/todos';

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, done: false })
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText('');
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(todo => todo._id !== id));
  }

  const toggleTodo  = async (todo) => {
    const res = await fetch(`${API}/${todo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done })
    });
    const updatedTodo = await res.json();
    setTodos(todos.map(t => t._id === todo._id ? updatedTodo : t));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={addTodo}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => 
          <li key={todo._id}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo)} />&nbsp;
            {todo.text}&nbsp;
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
          )}
      </ul>
    </div>
  );
}

export default App;