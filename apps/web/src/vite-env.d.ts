/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_MVP_VERSION?: string;
  readonly VITE_GAME_DATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
