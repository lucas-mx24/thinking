import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (name.trim().length < 3) {
            setError('O nome deve ter pelo menos 3 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: `${window.location.origin}/login`
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/confirmation');
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden font-display transition-colors duration-300">
            <main className="flex-1 flex flex-col p-8 items-center justify-center gap-6 animate-slide-up">

                <div className="text-center w-full mb-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Criar Conta</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comece sua jornada de clareza hoje.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nome Completo</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px] group-focus-within:text-primary transition-colors">person</span>
                            <input
                                type="text"
                                placeholder="Como quer ser chamado?"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Senha</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 px-1 mt-1">
                        <input type="checkbox" required className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Eu concordo com os <span className="text-primary font-bold">Termos de Uso</span> e a <span className="text-primary font-bold">Política de Privacidade</span>.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Já tem uma conta? <Link to="/login" className="text-primary font-bold hover:underline">Entre aqui</Link>
                </p>
            </main>
        </div>
    );
};

export default Signup;
