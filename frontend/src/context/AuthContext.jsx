import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize with null to force login flow
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const toggleRole = () => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            role: prev.role === 'JE' ? 'SSE' : 'JE',
            designation: prev.role === 'JE' ? 'Senior Section Engineer' : 'Junior Engineer'
        }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, toggleRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
