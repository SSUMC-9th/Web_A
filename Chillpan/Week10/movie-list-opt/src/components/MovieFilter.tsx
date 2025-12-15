import type { MovieLanguage, MoveFilter } from "../types/movie";
import { memo, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./input";
import { SelectBox } from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { MOVIE_LANGUAGES } from "../constansts/movie";

interface MovieFilterProps {
  onChange: (filter: MoveFilter) => void;
  initialFilters?: MoveFilter;
}

const MovieFilter = ({ onChange, initialFilters }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>(initialFilters?.query || "");
  const [includeAdult, setIncludeAdult] = useState<boolean>(
    initialFilters?.include_adult || false
  );
  const [language, setLanguage] = useState<MovieLanguage>(
    initialFilters?.language || "ko-KR"
  );

  // 0.5초 debounce 적용
  const [debouncedQuery] = useDebounce(query, 500);

  // debounce된 query가 변경될 때만 검색 실행
  useEffect(() => {
    const filters: MoveFilter = {
      query: debouncedQuery,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  }, [debouncedQuery, includeAdult, language, onChange]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const filters: MoveFilter = {
      query,
      include_adult: includeAdult,
      language,
    };
    console.log(filters);
    onChange(filters);
  };
  return (
    <div className="transform space-y-6 rounded-2xl border-gray-300 bg-white p-6 shadow-md transition-all hover:shadow-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-6 justify-center items-end"
      >
        <div className="min-w-[300px] max-w-[450px] flex-1">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700">
            영화 제목
          </label>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="검색어를 입력하세요"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[200px] max-w-[250px] flex-1">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700">
            Option
          </label>
          <SelectBox
            checked={includeAdult}
            onChange={setIncludeAdult}
            label="성인 콘텐츠 포함"
            id="include_adult"
            className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[200px] max-w-[250px] flex-1">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700">
            언어
          </label>
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            options={MOVIE_LANGUAGES}
            className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold transition-all hover:bg-blue-600 hover:shadow-lg hover:scale-105"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(MovieFilter);
