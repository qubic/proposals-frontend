/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_QUBIC_RPC_URL: string
  readonly VITE_QLI_API_URL: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __APP_VERSION__: string
