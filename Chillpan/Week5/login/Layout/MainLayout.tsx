import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import Sidebar from "./Sidebar";
import { useSidebar } from "../hooks/useSidebar";

const MainLayout = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close, toggle } = useSidebar(); // 구조분해할당

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header
        currentOrder={order}
        onOrderChange={setOrder}
        onSearchClick={open}
        onMenuClick={toggle}
      />
      <Sidebar
        isOpen={isOpen}
        onClose={close}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      <main className="flex-1 pt-16 pb-20 overflow-auto">
        <Outlet context={{ order, searchTerm, setSearchTerm }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
