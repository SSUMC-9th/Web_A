import { useState, FormEvent, memo } from 'react';
import { LanguageOption } from '../types/movie.types';

interface MovieSearchProps {
  onSearch: (query: string, includeAdult: boolean, language: LanguageOption) => void;
  loading: boolean;
}

function MovieSearch({ onSearch, loading }: MovieSearchProps) {
  console.log('🟢 MovieSearch 렌더링'); // 최적화 후 확인
  
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<LanguageOption>('ko-KR');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query, includeAdult, language);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      {/* ... 동일한 JSX ... */}
    </form>
  );
}

// memo로 감싸기 - onSearch가 변경되지 않으면 리렌더링 방지
export default memo(MovieSearch);