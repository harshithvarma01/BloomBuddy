/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ML_API_URL: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_DEFAULT_LLM_PROVIDER: string
  readonly VITE_MAX_CONVERSATION_HISTORY: string
  readonly VITE_CHAT_TIMEOUT_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
