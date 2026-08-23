/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Published Google Sheet CSV URL (File → Share → Publish to web → CSV). */
  readonly VITE_SHEET_CSV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
