interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_SERVER_URL: string
  readonly VITE_APP_FOLDER_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_API_KEY: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}