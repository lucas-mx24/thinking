import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    const handleQuickAdmin = () => {
        setEmail('admin@thinking.com');
        setPassword('admin123456');
        // We'll let the user click "Entrar" manually to see the transition,
        // or we could auto-trigger it. Let's auto-fill for now.
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden font-display transition-colors duration-300">
            <main className="flex-1 flex flex-col p-8 items-center justify-center gap-8 animate-fade-in">

                {/* Logo/Icon */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/20 rotate-12">
                        <span className="material-symbols-outlined !text-[48px] text-background-dark -rotate-12">edit_note</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Thinking</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sua mente, organizada.</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="w-full flex flex-col gap-4 mt-4" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">E-mail</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Senha</label>
                            <Link to="/recovery" className="text-[11px] font-bold text-primary hover:underline">Esqueceu?</Link>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined !text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Não tem uma conta? <Link to="/signup" className="text-primary font-bold hover:underline">Cadastre-se</Link>
                </p>

                {/* Quick Admin Access */}
                <div className="w-full flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleQuickAdmin}
                        className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-2xl text-xs font-bold hover:bg-primary/20 transition-all border border-primary/5"
                    >
                        <span className="material-symbols-outlined !text-[18px]">verified_user</span>
                        Acesso Rápido Admin
                    </button>
                    <p className="text-[10px] text-center text-slate-400 italic">Para testes em produção sem cadastro.</p>
                </div>

                {/* Social Login (Bonus) */}
                <div className="w-full flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Ou continue com</span>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    </div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 py-3.5 rounded-2xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-5" alt="Google" />
                        Google
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
