import React from "react";

const Home = React.lazy(() => import("./pages/Home"));
const Users = React.lazy(() => import("./pages/Users"));
const UserDetail = React.lazy(() => import("./pages/UserDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

export type RouteMatch = {
  element: React.ReactElement;
  params: Record<string, string>;
};

export const routes = [
  { pattern: new URLPattern({ pathname: "/" }), element: <Home /> },
  { pattern: new URLPattern({ pathname: "/users" }), element: <Users /> },
  { pattern: new URLPattern({ pathname: "/users/:id" }), element: <UserDetail /> },
] as const;

export const fallback = <NotFound />;
