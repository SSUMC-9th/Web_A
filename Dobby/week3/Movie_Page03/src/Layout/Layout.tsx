import { NavLink, Outlet } from "react-router-dom";

const tab = (isActive: boolean) =>
  `px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive ? "text-emerald-600" : "text-neutral-500 hover:text-neutral-300"
  }`;

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <nav className="mx-auto max-w-6xl p-4 flex gap-3">
          <NavLink to="/" className={({ isActive }) => tab(isActive)}>홈</NavLink>
          <NavLink to="/popular" className={({ isActive }) => tab(isActive)}>인기 영화</NavLink>
          <NavLink to="/now_playing" className={({ isActive }) => tab(isActive)}>상영 중</NavLink>
          <NavLink to="/top_rated" className={({ isActive }) => tab(isActive)}>평점 높은</NavLink>
          <NavLink to="/upcoming" className={({ isActive }) => tab(isActive)}>개봉 예정</NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
