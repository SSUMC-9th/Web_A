/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
  readonly VITE_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
