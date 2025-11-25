// HomeLayout.tsx

import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav></nav>
      <main className="flex-1">
        <Outlet /> {/* 자식 라우터가 렌더링 될 위치 */}
      </main>
      <footer>푸터</footer>
    </div>
  );
};

export default HomeLayout;
