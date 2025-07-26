import { llmConfig, validateLLMConfig } from './llm-config';
import type { ConversationMessage } from './conversation-memory';

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export interface LLMError {
  message: string;
  code?: string;
  provider: string;
}

class LLMService {
  private currentProvider: keyof typeof llmConfig.providers;

  constructor() {
    this.currentProvider = llmConfig.defaultProvider;
  }

  async generateResponse(
    messages: ConversationMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<LLMResponse> {
    if (!validateLLMConfig()) {
      throw new Error(`API key not configured for ${this.currentProvider}`);
    }

    const provider = llmConfig.providers[this.currentProvider];
    
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.callOpenAI(messages, provider, options);
        case 'anthropic':
          return await this.callAnthropic(messages, provider, options);
        case 'google':
          return await this.callGoogle(messages, provider, options);
        default:
          throw new Error(`Unsupported provider: ${this.currentProvider}`);
      }
    } catch (error) {
      console.error(`LLM API Error (${this.currentProvider}):`, error);
      throw this.handleError(error);
    }
  }

  private async callOpenAI(
    messages: ConversationMessage[],
    provider: typeof llmConfig.providers.openai,
    options?: any
  ): Promise<LLMResponse> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : msg.role,
          content: msg.content
        })),
        max_tokens: options?.maxTokens || provider.maxTokens,
        temperature: options?.temperature || 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      },
      model: data.model,
      provider: 'openai'
    };
  }

  private async callAnthropic(
    messages: ConversationMessage[],
    provider: typeof llmConfig.providers.anthropic,
    options?: any
  ): Promise<LLMResponse> {
    try {
      // Use local proxy instead of direct API call to avoid CORS
      const mlApiUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000/api';
      
      // Extract system message and user/assistant messages
      const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
      const conversationMessages = messages.filter(msg => msg.role !== 'system');

      console.log('Calling Anthropic API via proxy with model:', provider.model);

      const requestBody = {
        provider: 'anthropic',
        model: provider.model,
        system: systemMessage,
        messages: conversationMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        options: {
          maxTokens: options?.maxTokens || provider.maxTokens,
          temperature: options?.temperature || 0.7
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${mlApiUrl}/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Proxy API Error Response:', errorText);
        
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(`LLM Proxy Error: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('LLM Proxy Response:', data);
      
      return {
        content: data.content || '',
        usage: data.usage || {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        model: data.model || provider.model,
        provider: 'anthropic'
      };
    } catch (error) {
      console.error('Anthropic call error:', error);
      throw error;
    }
  }

  private async callGoogle(
    messages: ConversationMessage[],
    provider: typeof llmConfig.providers.google,
    options?: any
  ): Promise<LLMResponse> {
    // Convert conversation to Google's format
    const contents = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    const response = await fetch(
      `${provider.baseUrl}/models/${provider.model}:generateContent?key=${provider.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: options?.maxTokens || provider.maxTokens,
            temperature: options?.temperature || 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      },
      model: provider.model,
      provider: 'google'
    };
  }

  private handleError(error: any): LLMError {
    return {
      message: error.message || 'Unknown LLM error',
      code: error.code,
      provider: this.currentProvider
    };
  }

  setProvider(provider: keyof typeof llmConfig.providers): void {
    if (!llmConfig.providers[provider]) {
      throw new Error(`Invalid provider: ${provider}`);
    }
    this.currentProvider = provider;
  }

  getCurrentProvider(): string {
    return this.currentProvider;
  }

  getAvailableProviders(): Array<{ key: string; name: string; configured: boolean }> {
    return Object.entries(llmConfig.providers).map(([key, config]) => ({
      key,
      name: config.name,
      configured: Boolean(config.apiKey)
    }));
  }
}

export default LLMService;
