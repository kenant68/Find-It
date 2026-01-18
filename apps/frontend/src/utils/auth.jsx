import { useState, useEffect, useContext, createContext } from 'react';
import { login as apiLogin, register as apiRegister } from './api.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    setUser({ id: payload.id });
                    setToken(storedToken);
                } catch (error) {
                    console.error('Token invalide:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await apiLogin(email, password);

            if (response.token) {
                localStorage.setItem('token', response.token);
                setToken(response.token);

                const payload = JSON.parse(atob(response.token.split('.')[1]));
                setUser({ id: payload.id });

                return { success: true };
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await apiRegister(userData);

            if (response) {
                return await login(userData.email, userData.password);
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};