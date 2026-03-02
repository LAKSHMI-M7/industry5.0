import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setCurrentRole(userData.role);
                axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setIsAuthenticating(true);
        setUser(null);
        setCurrentRole(null);

        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data);
            setCurrentRole(data.role);
            localStorage.setItem('user', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } finally {
            setIsAuthenticating(false);
        }
    };

    const changePassword = async (newPassword) => {
        await axios.post('/api/auth/change-password', { password: newPassword });
        const updatedUser = { ...user, isFirstLogin: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        setCurrentRole(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const switchRole = (role) => {
        if (user?.allowedRoles?.includes(role)) {
            setCurrentRole(role);
        }
    };

    const updateUser = (data) => {
        const newUser = { ...user, ...data };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, currentRole, loading, isAuthenticating, login, logout, switchRole, changePassword, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
