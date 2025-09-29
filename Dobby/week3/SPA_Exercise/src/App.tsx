import { Suspense } from "react";
import { RouterProvider } from "./router";
import { useRouter } from "./useRouter";
import Link from "./Link";

export default function App() {
  const { pathname } = useRouter();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/users/42">User #42</Link>
      </nav>
      <small style={{ opacity: 0.7 }}>Current: {pathname}</small>
      <div style={{ marginTop: 12 }}>
        <Suspense fallback={<p>Loading…</p>}>
          <RouterProvider render={(element) => element} />
        </Suspense>
      </div>
    </div>
  );
}
