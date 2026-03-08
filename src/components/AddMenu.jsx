import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const options = [
        { label: 'Nota Rápida', icon: 'bolt', color: 'bg-primary text-background-dark', action: () => { navigate('/create'); onClose(); } },
        { label: 'Nova Reflexão', icon: 'self_improvement', color: 'bg-primary/20 text-primary', action: () => { navigate('/create'); onClose(); } },
        { label: 'Lista de Tarefas', icon: 'checklist', color: 'bg-blue-100 text-blue-600', action: () => { navigate('/create'); onClose(); } },
        { label: 'Nova Ideia', icon: 'lightbulb', color: 'bg-amber-100 text-amber-600', action: () => { navigate('/create'); onClose(); } },
    ];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end p-6 bg-background-dark/80 backdrop-blur-sm animate-fade-in">
            {/* Tap area to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Menu Container */}
            <div className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl animate-slide-up">
                <div className="flex flex-col gap-4">
                    <h2 className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2">Adicionar Novo</h2>

                    <div className="grid grid-cols-2 gap-3">
                        {options.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={opt.action}
                                className="flex flex-col items-center gap-3 p-4 rounded-3xl group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                            >
                                <div className={`size-12 flex items-center justify-center rounded-2xl shadow-sm group-hover:shadow-md transition-all ${opt.color}`}>
                                    <span className="material-symbols-outlined !text-[24px] shrink-0">{opt.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center leading-tight">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-2 size-12 self-center flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined !text-[24px]">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMenu;
