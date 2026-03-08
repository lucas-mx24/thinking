import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Profile = ({ user, darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, favorites: 0, archived: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('notes')
                .select('is_favorite, is_archived')
                .eq('user_id', user.id);

            if (!error && data) {
                setStats({
                    total: data.length,
                    favorites: data.filter(n => n.is_favorite).length,
                    archived: data.filter(n => n.is_archived).length
                });
            }
            setLoadingStats(false);
        };
        fetchStats();
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 transition-colors duration-300">
            <header className="mb-8 animate-fade-in flex justify-between items-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Perfil</h1>
                <Link
                    to="/settings"
                    className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm hover:bg-primary/20 transition-colors"
                >
                    <span className="material-symbols-outlined !text-[24px]">settings</span>
                </Link>
            </header>

            <main className="flex-1 flex flex-col gap-6 animate-slide-up">
                {/* User Card */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                    <div className="size-16 rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/20 flex items-center justify-center text-primary">
                        {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                            <span className="material-symbols-outlined !text-[32px]">account_circle</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{user.user_metadata?.full_name || 'Usuário'}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{user.email}</p>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="grid grid-cols-3 gap-3">
                    <MetricCard label="Total" value={stats.total} icon="description" color="text-primary" />
                    <MetricCard label="Favoritos" value={stats.favorites} icon="star" color="text-amber-500" />
                    <MetricCard label="Arquivo" value={stats.archived} icon="archive" color="text-slate-400" />
                </div>

                {/* Settings Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Preferências</h3>

                    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-primary/5"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">dark_mode</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Modo Escuro</span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <div className={`size-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">notifications</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notificações</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Data Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Segurança</h3>

                    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-primary/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Alterar Senha</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3 text-red-500">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="text-sm font-bold">Sair da Conta</span>
                            </div>
                            <span className="material-symbols-outlined text-red-300 group-hover:text-red-500">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto pb-32 text-center text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                    Thinking v1.0.0
                </div>
            </main>
        </div>
    );
};

const MetricCard = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm">
        <span className={`material-symbols-outlined !text-[20px] ${color}`}>{icon}</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
);

export default Profile;
