import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header
        currentOrder={order}
        onOrderChange={setOrder}
        onSearchClick={() => setShowSearch(!showSearch)}
      />
      <main className="flex-1 pt-16 pb-20 overflow-auto">
        <Outlet context={{ order, showSearch }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;


