import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState<string>('');

  return (
    <div>
      <nav style={{ padding: '10px', background: '#EEE' }}>
        <Link to="/">Dashboard</Link> |{' '}
        <Link to="/products">Products</Link> |{' '}
        <Link to="/orders">Orders</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard token={token} />} />
        <Route path="/products" element={<Products token={token} />} />
        <Route path="/orders" element={<Orders token={token} />} />
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
