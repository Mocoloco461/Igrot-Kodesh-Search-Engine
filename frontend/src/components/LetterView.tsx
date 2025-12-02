
import React from 'react';

interface LetterViewProps {
    letter: {
        id: string;
        vol: number;
        index: number;
        text: string;
    } | null;
    onClose: () => void;
    highlightTerm?: string;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export const LetterView: React.FC<LetterViewProps> = ({
    letter,
    onClose,
    highlightTerm,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}) => {
    if (!letter) return null;

    // Function to highlight text safely (skipping HTML tags)
    const getHighlightedText = (text: string, term?: string) => {
        if (!term || term.trim().length < 2) return text;

        // Escape special regex characters
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create regex that matches the term but tries to avoid HTML tags
        // This is a basic implementation. For robust HTML highlighting, a parser is better.
        // However, since we search mostly Hebrew, collisions with HTML tags (en) are rare.
        const regex = new RegExp(`(${escapedTerm})`, 'gi');

        return text.replace(regex, '<mark class="bg-yellow-200 text-slate-900 rounded-sm px-0.5">$1</mark>');
    };

    const highlightedContent = getHighlightedText(letter.text, highlightTerm);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10" dir="rtl">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">אגרות קודש - כרך {letter.vol}</h2>
                            <p className="text-slate-500">מכתב {letter.index + 1}</p>
                        </div>

                        <div className="flex items-center gap-2 mr-4">
                            <button
                                onClick={onNext}
                                disabled={!hasNext}
                                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="המכתב הבא"
                            >
                                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={onPrev}
                                disabled={!hasPrev}
                                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="המכתב הקודם"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8 bg-[#fdfbf7]">
                    <div
                        className="prose prose-lg max-w-none prose-p:font-serif prose-headings:font-sans text-slate-800"
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <button
                        onClick={() => {
                            const textToCopy = letter.text.replace(/<[^>]+>/g, ''); // Strip HTML
                            navigator.clipboard.writeText(textToCopy);
                            // Could add a toast here, but for now simple alert or button change
                            const btn = document.getElementById('copy-btn');
                            if (btn) {
                                const originalText = btn.innerText;
                                btn.innerText = 'הועתק!';
                                setTimeout(() => btn.innerText = originalText, 2000);
                            }
                        }}
                        id="copy-btn"
                        className="px-4 py-2 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        העתק טקסט
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        סגור
                    </button>
                </div>
            </div>
        </div>
    );
};
