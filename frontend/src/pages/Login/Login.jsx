import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Train, Lock, User, ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [role, setRole] = useState('JE'); // Default to Junior Engineer
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Senior Engineer Credentials
        if (credentials.id === 'abhiwork' && credentials.password === 'Dairy@qwertyuiop') {
            login({
                id: 'abhiwork',
                role: 'SSE',
                name: 'Abhishek Sharma',
                designation: 'Senior Section Engineer'
            });
            navigate('/');
            return;
        }

        // 2. Junior Engineer Credentials
        if (credentials.id === 'work@007' && credentials.password === 'Work@abc') {
            login({
                id: 'work@007',
                role: 'JE',
                name: 'Rajesh Kumar',
                designation: 'Junior Engineer'
            });
            navigate('/create-report');
            return;
        }

        // 3. Fallback for incorrect credentials
        alert("Invalid ID or Password. Please check your credentials.");
    };

    return (
        <div className="login-container">
            <div className="login-visual">
                <div className="visual-overlay"></div>
                <div className="visual-content">
                    <Train size={64} className="login-logo-big" />
                    <h1>RWPM</h1>
                    <p>Railway Work Progress Monitoring System</p>
                </div>
            </div>

            <div className="login-form-side">
                <form className="login-card glass-panel animate-fade-in" onSubmit={handleSubmit}>
                    <div className="form-header-login">
                        <h2>Portal Access</h2>
                        <p>Enter your credentials to manage site reports</p>
                    </div>


                    <div className="input-group">
                        <label>Employee ID</label>
                        <div className="input-with-icon">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Enter your ID"
                                required
                                value={credentials.id}
                                onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        Access System
                    </button>

                    <p className="login-tip">
                        Need help? Contact Divisional IT Helpdesk.
                    </p>
                </form>
            </div>
            <style>{`
        .form-header-login { margin-bottom: 2.5rem; }
        .form-header-login p { color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem; }
      `}</style>
        </div>
    );
};

export default Login;
