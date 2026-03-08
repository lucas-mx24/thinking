import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const PasswordRecovery = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            setError('Por favor, insira seu e-mail.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/confirmation'), 2000);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden font-display transition-colors duration-300">
            <header className="p-4 flex items-center">
                <Link to="/login" className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined !text-[24px]">arrow_back</span>
                </Link>
            </header>

            <main className="flex-1 flex flex-col p-8 items-center justify-center gap-6 animate-slide-up text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-2">
                    <span className="material-symbols-outlined !text-[32px]">lock_reset</span>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Recuperar Senha</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Insira seu e-mail abaixo. Enviaremos um link para você redefinir sua senha.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="w-full p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fade-in text-left flex items-center gap-3">
                        <span className="material-symbols-outlined !text-[18px]">check_circle</span>
                        E-mail de recuperação enviado com sucesso!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold animate-shake text-left">
                        {error}
                    </div>
                )}

                <form className="w-full flex flex-col gap-4" onSubmit={handleRecovery}>
                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">E-mail de Cadastro</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 !text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                </form>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    Lembrou a senha? <Link to="/login" className="text-primary font-bold hover:underline">Voltar ao Login</Link>
                </p>
            </main>
        </div>
    );
};

export default PasswordRecovery;
