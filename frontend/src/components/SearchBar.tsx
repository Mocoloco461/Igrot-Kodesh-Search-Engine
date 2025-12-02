import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string, type: 'exact' | 'contains') => void;
    isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'exact' | 'contains'>('contains');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query, type);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-center gap-2">
                    <div className="flex-1 w-full relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="חפש באגרות קודש..."
                            className="w-full px-6 py-4 text-lg bg-transparent border-none outline-none text-right placeholder-slate-400"
                            dir="rtl"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto px-2">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'exact' | 'contains')}
                            className="px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 border-none outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            dir="rtl"
                        >
                            <option value="contains">מכיל את</option>
                            <option value="exact">ביטוי מדויק</option>
                        </select>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    מחפש...
                                </span>
                            ) : (
                                'חפש'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
