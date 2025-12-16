import { useState, FormEvent } from 'react';
import { LanguageOption } from '../types/movie.types';

interface MovieSearchProps {
  onSearch: (query: string, includeAdult: boolean, language: LanguageOption) => void;
  loading: boolean;
}

function MovieSearch({ onSearch, loading }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<LanguageOption>('ko-KR');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, includeAdult, language);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="space-y-4">
        {/* 영화 제목 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            영화 제목
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 성인 콘텐츠 체크박스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="adult"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="adult" className="ml-2 text-sm text-gray-700">
            성인 콘텐츠 포함
          </label>
        </div>

        {/* 언어 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            언어 선택
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
          </select>
        </div>

        {/* 검색 버튼 */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
    </form>
  );
}

export default MovieSearch;