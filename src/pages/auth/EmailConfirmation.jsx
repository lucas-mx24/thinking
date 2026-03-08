import React from 'react';
import { Link } from 'react-router-dom';

const EmailConfirmation = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden font-display transition-colors duration-300">
            <main className="flex-1 flex flex-col p-8 items-center justify-center gap-8 animate-scale-in text-center">

                <div className="relative mb-4">
                    <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 animate-pulse">
                        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined !text-[40px]">mark_email_read</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">E-mail Enviado!</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px]">
                        Verifique sua caixa de entrada. Enviamos as instruções para <b>seu@email.com</b>.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <Link to="/login" className="w-full">
                        <button className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                            Voltar ao Login
                        </button>
                    </Link>

                    <button className="text-sm font-bold text-slate-400 hover:text-primary transition-colors py-2">
                        Não recebi o e-mail
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EmailConfirmation;
