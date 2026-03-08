import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const categories = [
    { name: 'Reflexão', icon: 'psychology', color: 'bg-primary/20 text-primary' },
    { name: 'Ideia', icon: 'lightbulb', color: 'bg-amber-100 text-amber-600' },
    { name: 'Tarefas', icon: 'task_alt', color: 'bg-blue-100 text-blue-600' },
    { name: 'Pessoal', icon: 'person', color: 'bg-purple-100 text-purple-600' }
];

const CreateNote = ({ user }) => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('Reflexão');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            setError('Por favor, preencha o título e o conteúdo.');
            return;
        }

        if (!user) {
            setError('Você precisa estar logado para salvar notas.');
            return;
        }

        setLoading(true);
        const { error: saveError } = await supabase
            .from('notes')
            .insert([
                {
                    title,
                    content,
                    category,
                    user_id: user.id,
                    is_favorite: false,
                    is_archived: false
                }
            ]);

        if (saveError) {
            console.error('Error saving note:', saveError);
            setError('Erro ao salvar nota. Tente novamente.');
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    const handleInsertList = () => {
        setContent(prev => prev + (prev.length > 0 && !prev.endsWith('\n') ? '\n- ' : '- '));
    };

    const handleFeatureAlert = (feature) => {
        alert(`Recurso "${feature}" estará disponível na próxima versão!`);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden transition-colors duration-300">

            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 justify-between border-b border-primary/10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-primary/5 transition-colors"
                >
                    <span className="material-symbols-outlined !text-[24px]">close</span>
                </button>
                <h1 className="text-lg font-bold">Novo Pensamento</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary text-background-dark px-5 py-1.5 rounded-full text-sm font-bold shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6 gap-8 animate-fade-in">
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                {/* Category Picker */}
                <div className="flex flex-col gap-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setCategory(cat.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 ${category === cat.name ? `${cat.color} ring-2 ring-primary/20 scale-105` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                <span className="material-symbols-outlined !text-[16px] shrink-0">{cat.icon}</span>
                                <span className="whitespace-nowrap">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Note Inputs */}
                <div className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Título do pensamento..."
                            className="bg-transparent border-none outline-none text-2xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 w-full p-0 focus:ring-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                    </div>

                    <textarea
                        placeholder="O que está passando pela sua mente agora?"
                        className="bg-transparent border-none outline-none text-base text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 w-full p-0 focus:ring-0 resize-none flex-1 min-h-[300px] leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-6 py-4 border-t border-primary/5 text-slate-400">
                    <button onClick={() => handleFeatureAlert('Adicionar Imagem')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined !text-[24px]">image</span>
                    </button>
                    <button onClick={() => handleFeatureAlert('Gravador de Voz')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined !text-[24px]">mic</span>
                    </button>
                    <button onClick={handleInsertList} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined !text-[24px]">format_list_bulleted</span>
                    </button>
                    <button onClick={() => handleFeatureAlert('Customizar Cores')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined !text-[24px]">palette</span>
                    </button>
                    <div className="ml-auto">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">{content.length} caracteres</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateNote;
