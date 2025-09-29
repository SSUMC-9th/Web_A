import { Suspense } from "react";
import { RouterProvider } from "./router";
import { useRouter } from "./useRouter";
import Link from "./Link";

export default function App() {
  const { pathname } = useRouter();
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 p-4">
          <Link to="/" className="font-semibold">Home</Link>
          <Link to="/movies" className="text-neutral-300 hover:text-white">
            Movies
          </Link>
          <span className="ml-auto text-xs text-neutral-500">Current: {pathname}</span>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Suspense fallback={<p className="p-6">Loading…</p>}>
          {/* router.tsx에서 정의한 render prop 사용 */}
          <RouterProvider render={(element) => element} />
        </Suspense>
      </main>
    </div>
  );
}
