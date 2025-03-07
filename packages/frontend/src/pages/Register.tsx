import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, password });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label><br />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
