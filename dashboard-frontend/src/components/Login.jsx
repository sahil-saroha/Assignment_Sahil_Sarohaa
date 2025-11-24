// dashboard-frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TEMPORARY LOGIN SIMULATION
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('token', 'dummy_token');
            navigate('/dashboard');
        } else {
            alert('Invalid credentials. Use admin/admin for a demo.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h3 className="card-title text-center text-primary mb-4">Dashboard Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;