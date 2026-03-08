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

    useEffect(() => {
        // Handle auth state
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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

    return (
        <Router>
            <div className={eyeProtection ? 'eye-protection-active' : ''}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                eyeProtection={eyeProtection}
                                setEyeProtection={setEyeProtection}
                                user={user}
                            />
                        }
                    />
                    <Route path="/create" element={<CreateNote user={user} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/recovery" element={<PasswordRecovery />} />
                    <Route path="/confirmation" element={<EmailConfirmation />} />
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                eyeProtection={eyeProtection}
                                setEyeProtection={setEyeProtection}
                            />
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            user ? (
                                <Profile
                                    user={user}
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
