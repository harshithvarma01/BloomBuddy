export interface LLMProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
}

export interface LLMConfig {
  providers: {
    openai: LLMProvider;
    anthropic: LLMProvider;
    google: LLMProvider;
  };
  defaultProvider: keyof LLMConfig['providers'];
  maxConversationHistory: number;
  chatTimeout: number;
}

export const llmConfig: LLMConfig = {
  providers: {
    openai: {
      name: 'OpenAI',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4-turbo-preview',
      maxTokens: 4000
    },
    anthropic: {
      name: 'Anthropic Claude',
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-5-sonnet-20241022', // Latest Claude model optimized for reasoning
      maxTokens: 8000 // Increased for comprehensive medical recommendations
    },
    google: {
      name: 'Google',
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      model: 'gemini-pro',
      maxTokens: 4000
    }
  },
  // Default to Claude for medical applications
  defaultProvider: 'anthropic',
  maxConversationHistory: parseInt(import.meta.env.VITE_MAX_CONVERSATION_HISTORY || '20'),
  chatTimeout: parseInt(import.meta.env.VITE_CHAT_TIMEOUT_MS || '45000') // Increased timeout for medical analysis
};

export const validateLLMConfig = (): boolean => {
  // Since we're using a proxy, we just need to check if the ML API URL is configured
  const mlApiUrl = import.meta.env.VITE_ML_API_URL;
  return Boolean(mlApiUrl);
};
