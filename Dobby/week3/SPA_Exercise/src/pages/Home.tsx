import React from "react";
import Link from "../Link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <p>History API 기반 SPA 라우팅(TypeScript)</p>
      <Link to="/users">사용자 목록 보기</Link>
    </>
  );
}
