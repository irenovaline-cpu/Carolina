/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNICORN_API_KEY: string
  readonly VITE_UNICORN_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
