import React from "react";
const Home = React.lazy(() => import("./pages/Home"));
const Movies = React.lazy(() => import("./pages/Movies"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

export const routes = [
  { pattern: new URLPattern({ pathname: "/" }), element: <Home /> },
  { pattern: new URLPattern({ pathname: "/movies" }), element: <Movies /> },
] as const;

export const fallback = <NotFound />;
