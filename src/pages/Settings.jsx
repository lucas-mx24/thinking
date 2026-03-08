import React from 'react';
import { Link } from 'react-router-dom';

const Settings = ({ darkMode, setDarkMode, eyeProtection, setEyeProtection }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <header className="p-4 flex items-center gap-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md sticky top-0 z-20 border-b border-primary/10">
                <Link to="/" className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined !text-[24px]">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Configurações</h1>
            </header>

            <main className="flex-1 p-6 flex flex-col gap-8 animate-slide-up">
                {/* Visual Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Visual e Experiência</h3>
                    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                        <SettingToggle
                            icon="dark_mode"
                            label="Modo Escuro"
                            active={darkMode}
                            onToggle={() => setDarkMode(!darkMode)}
                        />
                        <SettingToggle
                            icon="visibility"
                            label="Proteção Ocular"
                            active={eyeProtection}
                            onToggle={() => setEyeProtection(!eyeProtection)}
                        />
                    </div>
                </section>

                {/* Account Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Conta e Idioma</h3>
                    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                        <SettingItem icon="language" label="Idioma" value="Português (Brasil)" />
                        <SettingItem icon="sync" label="Sincronização" value="Ativado" />
                    </div>
                </section>

                {/* Storage Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Armazenamento</h3>
                    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                        <SettingItem icon="database" label="Uso de Dados" value="2.4 MB" />
                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-500">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined">delete_forever</span>
                                <span className="text-sm font-bold">Limpar Cache do App</span>
                            </div>
                        </button>
                    </div>
                </section>

                <div className="mt-auto text-center py-4">
                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mb-1">Thinking App</p>
                    <p className="text-[10px] text-slate-300">Versão 1.0.0 (Build 2024)</p>
                </div>
            </main>
        </div>
    );
};

const SettingToggle = ({ icon, label, active, onToggle }) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-primary/5 last:border-0"
    >
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">{icon}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`size-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
        </div>
    </button>
);

const SettingItem = ({ icon, label, value }) => (
    <div className="w-full flex items-center justify-between p-4 border-b border-primary/5 last:border-0">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">{icon}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-bold">{value}</span>
            <span className="material-symbols-outlined text-slate-300 !text-[18px]">chevron_right</span>
        </div>
    </div>
);

export default Settings;
