import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { ResponseLpListDto } from "../src/types/lp";

interface OutletContextType {
  order: "asc" | "desc";
  showSearch: boolean;
}

const HomePage = () => {
  const { order, showSearch } = useOutletContext<OutletContextType>();
  const [search, setSearch] = useState("");

  const { data, isPending, isError, error } = useGetLpList({
    search,
    order: order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc,
  });

  const lpList = data as ResponseLpListDto | undefined;

  return (
    <div className="min-h-full p-4">
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-600"
          />
        </div>
      )}

      {isPending && <div className="text-white">Loading...</div>}

      {isError && <div className="text-white">Error: {error?.message}</div>}

      {!isPending && !isError && (
        <>
          {!lpList ||
          !lpList.data ||
          !lpList.data.data ||
          lpList.data.data.length === 0 ? (
            <div className="text-white">데이터가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {lpList.data.data.map((lp) => (
                <div
                  key={lp.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square bg-gray-700 flex items-center justify-center overflow-hidden">
                    {lp.thumbnail ? (
                      <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-4xl">🎵</span>
                    )}
                  </div>
                  <div className="p-3 text-white">
                    <h3 className="font-semibold truncate">{lp.title}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      {lp.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
