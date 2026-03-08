import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PasswordRecovery from './pages/auth/PasswordRecovery';
import EmailConfirmation from './pages/auth/EmailConfirmation';

import { supabase } from './lib/supabase';

const App = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [eyeProtection, setEyeProtection] = useState(false);
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle auth state
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const ProtectedRoute = ({ children }) => {
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    const PublicRoute = ({ children }) => {
        if (user) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <Router>
            <div className={eyeProtection ? 'eye-protection-active' : ''}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                    eyeProtection={eyeProtection}
                                    setEyeProtection={setEyeProtection}
                                    user={user}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/create" element={<ProtectedRoute><CreateNote user={user} /></ProtectedRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                    <Route path="/recovery" element={<PublicRoute><PasswordRecovery /></PublicRoute>} />
                    <Route path="/confirmation" element={<EmailConfirmation />} />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                    eyeProtection={eyeProtection}
                                    setEyeProtection={setEyeProtection}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile
                                    user={user}
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
