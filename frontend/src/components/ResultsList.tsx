import React from 'react';

interface Result {
    id: string;
    vol: number;
    index: number;
    snippet: string;
}

interface ResultsListProps {
    results: Result[];
    onSelect: (id: string) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, onSelect }) => {
    if (results.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-4 w-full max-w-4xl mx-auto pb-20">
            {results.map((result) => (
                <div
                    key={result.id}
                    onClick={() => onSelect(result.id)}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer group"
                    dir="rtl"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                            אגרות קודש - כרך {result.vol}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                            מכתב {result.index + 1}
                        </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {result.snippet}
                    </p>
                </div>
            ))}
        </div>
    );
};
