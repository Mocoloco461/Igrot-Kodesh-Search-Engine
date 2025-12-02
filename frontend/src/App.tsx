import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsList } from './components/ResultsList';
import { LetterView } from './components/LetterView';

interface SearchResult {
  id: string;
  vol: number;
  index: number;
  snippet: string;
}

interface Letter {
  id: string;
  vol: number;
  index: number;
  text: string;
}

function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query: string, type: 'exact' | 'contains') => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentQuery(query);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&exact=${type === 'exact'}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLetter = async (id: string) => {
    try {
      const response = await fetch(`/api/letter/${id}`);
      const data = await response.json();
      setSelectedLetter(data);
    } catch (error) {
      console.error('Failed to fetch letter:', error);
    }
  };

  const handleNext = () => {
    if (!selectedLetter || results.length === 0) return;
    const currentIndex = results.findIndex(r => r.id === selectedLetter.id);
    if (currentIndex >= 0 && currentIndex < results.length - 1) {
      handleSelectLetter(results[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (!selectedLetter || results.length === 0) return;
    const currentIndex = results.findIndex(r => r.id === selectedLetter.id);
    if (currentIndex > 0) {
      handleSelectLetter(results[currentIndex - 1].id);
    }
  };

  // Calculate navigation state
  const currentIndex = selectedLetter ? results.findIndex(r => r.id === selectedLetter.id) : -1;
  const hasNext = currentIndex >= 0 && currentIndex < results.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero Section */}
      <div className={`text-center transition-all duration-500 ${hasSearched ? 'mb-8' : 'mb-16 mt-20'}`}>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            אגרות קודש
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          מנוע חיפוש מתקדם לאגרות קודש של הרבי מליובאוויטש
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Results */}
      <div className="w-full flex justify-center">
        {isLoading ? (
          <div className="mt-12 flex flex-col items-center text-slate-400">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p>מחפש בארכיון...</p>
          </div>
        ) : (
          <>
            {hasSearched && results.length === 0 ? (
              <div className="mt-12 text-center text-slate-500">
                <p className="text-xl font-medium">לא נמצאו תוצאות</p>
                <p className="mt-2">נסה לשנות את מילות החיפוש או את סוג החיפוש</p>
              </div>
            ) : (
              <ResultsList results={results} onSelect={handleSelectLetter} />
            )}
          </>
        )}
      </div>

      {/* Letter Modal */}
      <LetterView
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
        highlightTerm={currentQuery}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

      <footer className="w-full mt-auto py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} חיפוש אגרות קודש. נבנה באמצעות טכנולוגיה מתקדמת.</p>
      </footer>
    </div>
  );
}

export default App;
