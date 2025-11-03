import { useMemo, useState } from "react";
import ErrorView from "../components/ErrorView";
import LPCard from "../components/LPCard";
import Spinner from "../components/Spinner";
import { PAGINATION_ORDER } from "../enums/common";
import { useLpList } from "../hooks/queries/useLpList";

type LpItem = {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string | Date;
  likes: unknown[];
};

const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { data, isLoading, isError, refetch } = useLpList({ limit: 40, order });

  const items: LpItem[] = useMemo(() => {
    return (data?.data?.data ?? []) as unknown as LpItem[];
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4 gap-2">
        <button
          onClick={() =>
            setOrder((o) =>
              o === PAGINATION_ORDER.desc ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc
            )
          }
          className="h-8 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
        >
          {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
        </button>
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorView onRetry={() => void refetch()} />}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((lp) => (
            <LPCard
              key={lp.id}
              id={lp.id}
              title={lp.title}
              thumbnail={lp.thumbnail}
              createdAt={lp.createdAt}
              likesCount={(lp.likes as unknown[]).length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
