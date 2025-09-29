// (옵션) 구형 브라우저용 폴리필
// import "urlpattern-polyfill";

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
