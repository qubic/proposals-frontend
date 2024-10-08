/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_QUBIC_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __APP_VERSION__: string
