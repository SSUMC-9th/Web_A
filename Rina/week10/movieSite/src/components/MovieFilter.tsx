import { memo, useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import LanguageSelector from "./LanguageSelector";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange } : MovieFilterProps) => {
    console.log("리렌더링, Movie Filter");
    const [query, setQuery] = useState<string>("");
    const [includeAdult, setIncludeAdult] = useState<boolean>(false);
    const [language, setLanguage] = useState<MovieLanguage>("ko-KR");


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 새로고침 방지
        e.preventDefault();
        const filters: MovieFilters = {
            query,
            include_adult: includeAdult,
            language,
        };
        console.log(filters);
        onChange(filters);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="transform space-y-6 rounded-2xl border-gray-300 bg-white
            p-6 mb-5 shadow-xl transition-all hover:shadow-2xl"
        >
            <div className="flex flex-wrap gap-6">
                <div className="min-w-[450px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        영화 제목
                    </label>
                    <Input value={query} onChange={setQuery} />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        ⚙️옵션
                    </label>
                    <SelectBox
                        checked={includeAdult}
                        onChange={setIncludeAdult}
                        label="성인 콘텐츠 표시"
                        id="include_adult"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:font-semibold"
                        
                    />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        🌐언어
                    </label>
                    <LanguageSelector
                        value={language}
                        onChange={setLanguage}
                        options={LANGUAGE_OPTIONS}
                        className="w-full rounded-lg border-gray-300 px-4 py-2
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="cursor-pointer bg-blue-400 rounded-lg border-blue-500 px-4 py-1"
                    >
                        🔎검색
                    </button>
                </div>
            </div>
        </form>
    )
}

export default memo(MovieFilter);
