import { memo, useEffect, useState } from 'react';
import { LANGUAGE_OPTIONS } from '../constants/movie';
import type { MovieFilters } from '../types/movie';
import Input from './input';
import LanguageSelector from './LauguageSelector';
import SelectBox from './SelectBox';

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
  initialFilters?: MovieFilters;
}

const MovieFilter = ({ onChange, initialFilters }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>(initialFilters?.query ?? '');
  const [includeAdult, setIncludeAdult] = useState<boolean>(initialFilters?.include_adult ?? false);
  const [language, setLanguage] = useState(initialFilters?.language ?? 'ko-KR');

  useEffect(() => {
    if (!initialFilters) return;
    setQuery(initialFilters.query ?? '');
    setIncludeAdult(initialFilters.include_adult ?? false);
    setLanguage(initialFilters.language ?? 'ko-KR');
  }, [initialFilters]);

  const handleSubmit = () => {
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  };

  return (
    <div className="transform space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur transition-all hover:bg-white/10 hover:shadow-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[450px] flex-1">
            <label className="mb-2 block text-sm font-semibold text-neutral-200">영화제목</label>
            <Input
              value={query}
              onChange={setQuery}
              placeholder="예: 어벤져스, 기생충, 인셉션..."
            />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-sm font-semibold text-neutral-200">옵션</label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표기"
              id="includeAdult"
              className="w-full rounded-lg border border-white/10 bg-black/30 p-3"
            />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-sm font-semibold text-neutral-200">언어</label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
              className=""
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
            >
              영화 검색
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(MovieFilter);
