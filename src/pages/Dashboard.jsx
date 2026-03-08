import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddMenu from '../components/AddMenu';
import { supabase } from '../lib/supabase';

const Dashboard = ({ darkMode, setDarkMode, eyeProtection, setEyeProtection, user }) => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Tudo');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('Notas');
    const scrollRef = React.useRef(null);
    const fileInputRef = useRef(null);

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const hasMovedRef = useRef(false);

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const handleMouseDown = (e) => {
            isDraggingRef.current = true;
            startXRef.current = e.pageX - slider.offsetLeft;
            scrollLeftRef.current = slider.scrollLeft;
            hasMovedRef.current = false;
            slider.style.cursor = 'grabbing';
        };

        const handleMouseLeave = () => {
            isDraggingRef.current = false;
            slider.style.cursor = 'grab';
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            slider.style.cursor = 'grab';
        };

        const handleMouseMove = (e) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startXRef.current) * 2;
            if (Math.abs(walk) > 5) {
                hasMovedRef.current = true;
            }
            slider.scrollLeft = scrollLeftRef.current - walk;
        };

        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mouseleave', handleMouseLeave);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mousemove', handleMouseMove);

        return () => {
            slider.removeEventListener('mousedown', handleMouseDown);
            slider.removeEventListener('mouseleave', handleMouseLeave);
            slider.removeEventListener('mouseup', handleMouseUp);
            slider.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [user, activeTab]);

    const fetchNotes = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        let query = supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (activeTab === 'Favoritos') {
            query = query.eq('is_favorite', true);
        } else if (activeTab === 'Arquivo') {
            query = query.eq('is_archived', true);
        } else {
            query = query.eq('is_archived', false);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching notes:', error);
        } else {
            setNotes(data || []);
        }
        setLoading(false);
    };

    const handlePhotoUpload = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você deve selecionar uma imagem para fazer upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) {
                throw updateError;
            }

            alert('Foto de perfil atualizada!');
            setIsAvatarMenuOpen(false);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const toggleFavorite = async (id, currentStatus) => {
        const { error } = await supabase
            .from('notes')
            .update({ is_favorite: !currentStatus })
            .eq('id', id);
        if (!error) {
            setNotes(notes.map(n => n.id === id ? { ...n, is_favorite: !currentStatus } : n));
        }
    };

    const toggleArchive = async (id, currentStatus) => {
        const { error } = await supabase
            .from('notes')
            .update({ is_archived: !currentStatus })
            .eq('id', id);
        if (!error) {
            setNotes(notes.map(n => n.id === id ? { ...n, is_archived: !currentStatus } : n));
        }
    };

    const deleteNote = async (id) => {
        if (window.confirm('Tem certeza que deseja apagar este pensamento?')) {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);
            if (!error) {
                setNotes(notes.filter(n => n.id !== id));
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const filteredNotes = notes.filter(n =>
        (activeCategory === 'Tudo' || n.category === activeCategory) &&
        (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden transition-colors duration-300">
            {eyeProtection && <div className="eye-protection-overlay" />}

            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 justify-between border-b border-primary/10">
                <div className="flex items-center gap-3">
                    <Link
                        to="/settings"
                        className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined !text-[24px]">settings</span>
                    </Link>
                    {!searchOpen && <h1 className="text-xl font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-left-2">Meus Pensamentos</h1>}
                </div>

                <div className="flex items-center gap-2 flex-1 justify-end">
                    {searchOpen ? (
                        <div className="flex items-center bg-primary/5 rounded-full px-3 py-1.5 w-full max-w-[200px] animate-in zoom-in-95 duration-200">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none outline-none text-sm w-full p-0 h-auto focus:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                                <span className="material-symbols-outlined !text-[18px] text-slate-400 hover:text-primary transition-colors">close</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex size-10 items-center justify-center rounded-full bg-transparent hover:bg-primary/5 transition-colors"
                        >
                            <span className="material-symbols-outlined !text-[24px]">search</span>
                        </button>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                            className="size-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 hover:border-primary transition-all active:scale-90"
                        >
                            <img
                                alt="Profile"
                                className="w-full h-full object-cover"
                                src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBsV0bYkdKnHBrUEXRDT6L1v3thQq_H3eyyanpih1WuDJBFkDYYqEAr18R1NNh3kX39ZJDeKhLNM8li5kJ_JJglF2u8Je5IDg2OaVtbj2BbGlyV5bsI1w9UXp_UZUCL5_LU_hvF5dYzMXyizrMQXmS5R7_5GZ7hBdluBDbkdqPHnVOeWeqGaExpDqo56FQAJI4gMXXy79cg24DwGJndRAXAUerC3i4G_RJqmXgHf0hBevWEaUjAib31QZ0tym12taLYtnCtvO3Mqk94"}
                            />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>

                        {/* Avatar Dropdown */}
                        {isAvatarMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 bg-transparent"
                                    onClick={() => setIsAvatarMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-primary/5 mb-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conta</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{user?.user_metadata?.full_name || user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-primary/5 transition-colors text-slate-600 dark:text-slate-400 text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined !text-[18px]">photo_camera</span>
                                        Trocar Foto
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-500 text-sm font-bold"
                                    >
                                        <span className="material-symbols-outlined !text-[18px]">logout</span>
                                        Sair
                                    </button>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>
            </header>

            {/* Settings Bar */}
            <div className="px-4 py-2 border-b border-primary/5 bg-white/50 dark:bg-slate-900/30 flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="material-symbols-outlined !text-[14px]">language</span>
                    <button className="text-primary font-bold">PT-BR</button>
                    <span className="text-slate-300">/</span>
                    <button className="hover:text-primary transition-colors">EN-US</button>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <span className={`material-symbols-outlined !text-[14px] transition-colors ${darkMode ? 'text-primary' : 'group-hover:text-primary'}`}>dark_mode</span>
                        <span className="group-hover:text-primary transition-colors">Modo Escuro</span>
                        <div className="w-6 h-3.5 bg-slate-200 dark:bg-primary/40 rounded-full relative">
                            <div className={`absolute ${darkMode ? 'right-0.5' : 'left-0.5'} top-0.5 w-2.5 h-2.5 bg-white dark:bg-primary rounded-full transition-all`}></div>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-1.5 cursor-pointer group"
                        onClick={() => setEyeProtection(!eyeProtection)}
                    >
                        <span className={`material-symbols-outlined !text-[14px] transition-colors ${eyeProtection ? 'text-primary' : 'group-hover:text-primary'}`}>visibility</span>
                        <span className="group-hover:text-primary transition-colors">Proteção Ocular</span>
                        <div className="w-6 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                            <div className={`absolute ${eyeProtection ? 'right-0.5' : 'left-0.5'} top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all shadow-sm`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Nav */}
            <nav
                ref={scrollRef}
                className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-3 select-none cursor-grab active:cursor-grabbing"
            >
                {['Tudo', 'Reflexão', 'Ideia', 'Tarefas', 'Pessoal'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => !hasMovedRef.current && setActiveCategory(cat)}
                        className={`flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${activeCategory === cat ? 'bg-primary text-background-dark shadow-md shadow-primary/20 scale-105' : 'bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-primary/20 hover:scale-105'}`}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm animate-pulse">Carregando seus pensamentos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        {filteredNotes.map((note) => (
                            <ThoughtCard
                                key={note.id}
                                {...note}
                                date={new Date(note.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                onToggleFavorite={() => toggleFavorite(note.id, note.is_favorite)}
                                onToggleArchive={() => toggleArchive(note.id, note.is_archived)}
                                onDelete={() => deleteNote(note.id)}
                            />
                        ))}
                        {filteredNotes.length === 0 && (
                            <div className="col-span-2 py-10 text-center flex flex-col items-center gap-3 animate-fade-in">
                                <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                <p className="text-slate-400 text-sm italic">
                                    {searchQuery ? 'Nenhum pensamento encontrado...' : 'Nenhum pensamento por aqui ainda.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 right-6 group z-30">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="flex size-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <span className="material-symbols-outlined !text-[32px] font-bold">add</span>
                </button>
            </div>

            {/* Overlay Menu */}
            <AddMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Bottom Nav */}
            <nav className="sticky bottom-0 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 flex justify-around items-center py-3 px-2 z-20">
                <NavItem active={activeTab === 'Notas'} onClick={() => setActiveTab('Notas')} icon="note_alt" label="Notas" />
                <NavItem active={activeTab === 'Favoritos'} onClick={() => setActiveTab('Favoritos')} icon="star" label="Favoritos" />
                <NavItem active={activeTab === 'Arquivo'} onClick={() => setActiveTab('Arquivo')} icon="archive" label="Arquivo" />
                <NavItem active={activeTab === 'Perfil'} onClick={() => setActiveTab('Perfil')} icon="account_circle" label="Perfil" />
            </nav>
        </div>
    );
};

const ThoughtCard = ({ title, content, category, date, is_favorite, is_archived, onToggleFavorite, onToggleArchive, onDelete }) => {
    const categoryColors = {
        'Reflexão': 'bg-primary/20 text-primary',
        'Ideia': 'bg-amber-100 text-amber-600',
        'Tarefas': 'bg-blue-100 text-blue-600',
        'Pessoal': 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-primary/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer duration-300 group relative">
            <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors group-hover:brightness-110 ${categoryColors[category] || categoryColors['Reflexão']}`}>{category}</span>
                <div className="flex items-center gap-1">
                    {is_favorite && <span className="material-symbols-outlined !text-[12px] text-amber-400">star</span>}
                    <span className="text-[10px] text-slate-400 font-medium lowercase">{date}</span>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-1 pt-3 border-t border-primary/5">
                <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className={`transition-all hover:scale-110 ${is_favorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`} title="Favoritar">
                    <span className={`material-symbols-outlined !text-[18px]`}>star</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleArchive(); }} className={`transition-all hover:scale-110 ${is_archived ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`} title="Arquivar">
                    <span className={`material-symbols-outlined !text-[18px]`}>archive</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="transition-all hover:scale-110 ml-auto text-slate-300 hover:text-red-400" title="Excluir">
                    <span className="material-symbols-outlined !text-[18px]">delete</span>
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
    <button className="flex flex-col items-center gap-1 group transition-all" onClick={onClick}>
        <span className={`material-symbols-outlined !text-[26px] transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-primary group-hover:scale-110'}`}>{icon}</span>
        <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-primary'}`}>{label}</span>
    </button>
);

export default Dashboard;
