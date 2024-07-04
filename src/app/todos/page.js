'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ name: '', description: '', finished: false });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {//for side effects
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/login'; 
      return;
    }
    fetchUser(token);
    fetchTodos(token);
  }, []);//bch el use effect te5dem mara bark   

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:1337/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const user = await res.json();
      setUser(user);
    } catch (err) {
      setError('Failed to fetch user information.');
    }
  };

  const fetchTodos = async (token) => {
    try {
      const userRes = await fetch('http://localhost:1337/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const user = await userRes.json();

      const res = await fetch(`http://localhost:1337/api/todos?filters[user][id][$eq]=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch todos.');
      }
      const { data } = await res.json();
      console.log('Fetched todos:', data);  
      const todos = data.map(item => ({ id: item.id, ...item.attributes }));
      setTodos(todos);
    } catch (err) {
      setError('Failed to fetch todos.');
    }
  };

  const addTodo = async (event) => {
    event.preventDefault();
    const token = Cookies.get('token');
    try {
      const userRes = await fetch('http://localhost:1337/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const user = await userRes.json();

      const res = await fetch('http://localhost:1337/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: { ...newTodo, user: user.id } })
      });
      if (!res.ok) {
        throw new Error('Failed to add todo.');
      }
      const { data } = await res.json();
      const addedTodo = { id: data.id, ...data.attributes };
      setTodos([...todos, addedTodo]);
      setNewTodo({ name: '', description: '', finished: false });
    } catch (err) {
      setError('Failed to add todo.');
    }
  };

  const deleteTodo = async (id) => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`http://localhost:1337/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to delete todo.');
      }
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`http://localhost:1337/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: updatedTodo })
      });
      if (!res.ok) {
        throw new Error('Failed to update todo.');
      }
      const { data } = await res.json();
      const updatedData = { id: data.id, ...data.attributes };
      setTodos(todos.map(todo => (todo.id === id ? updatedData : todo)));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundImage: 'url(https://cdn.dribbble.com/userupload/13624455/file/still-18c2554c70e71dc71b9619bb19387f4d.gif?resize=400x0)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <button 
        onClick={logout}
        className="fixed top-4 right-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg bg-opacity-90">
        {user && (
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Welcome back, {user.username}!
          </h2>
        )}
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Your Todos</h1>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form onSubmit={addTodo} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={newTodo.name}
                onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent" 
                placeholder="Name" 
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">Description</label>
              <input 
                type="text" 
                id="description" 
                name="description" 
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent" 
                placeholder="Description" 
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="finished"
              name="finished"
              checked={newTodo.finished}
              onChange={(e) => setNewTodo({ ...newTodo, finished: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="finished" className="ml-2 block text-sm text-gray-900">Finished</label>
          </div>
          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
          </div>
        </form>
        <ul className="mt-8 space-y-4">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex-1">
                <input
                  type="text"
                  value={todo.name}
                  readOnly
                  className="appearance-none bg-transparent border-none w-full text-gray-900 focus:outline-none text-xl font-semibold"
                />
                <input
                  type="text"
                  value={todo.description}
                  readOnly
                  className="appearance-none bg-transparent border-none w-full text-gray-900 focus:outline-none"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={todo.finished}
                    onChange={(e) => updateTodo(todo.id, { ...todo, finished: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Finished</label>
                </div>
              </div>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
