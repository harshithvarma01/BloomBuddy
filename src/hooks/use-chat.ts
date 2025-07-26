import { useState, useEffect, useRef } from 'react';
import LLMService from '@/lib/llm-service';
import ConversationMemoryManager, { ConversationMessage } from '@/lib/conversation-memory';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface UseChatOptions {
  initialReportData?: {
    fileName: string;
    analysis: string;
    uploadDate: string;
    fileType: string;
    fileSize: string;
  };
}

export const useChat = (options?: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const llmService = useRef(new LLMService());
  const memoryManager = useRef(new ConversationMemoryManager());
  const { toast } = useToast();

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (options?.initialReportData) {
      addReportContext(options.initialReportData);
    }
  }, [options?.initialReportData]);

  const initializeChat = () => {
    // Initialize or restore conversation
    const memory = memoryManager.current.initializeSession();
    
    // Convert memory messages to chat messages (excluding system messages for UI)
    const chatMessages = memory.messages
      .filter(msg => msg.role !== 'system')
      .map(convertTochatMessage);

    // Add welcome message if no previous conversation
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm BloomBuddy, your AI health companion. I'm here to help you understand your health better with personalized insights and analysis. How can I assist you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Add to memory
      memoryManager.current.addMessage({
        role: 'assistant',
        content: welcomeMessage.content,
        metadata: { messageType: 'general' }
      });
    } else {
      setMessages(chatMessages);
    }
  };

  const addReportContext = (reportData: UseChatOptions['initialReportData']) => {
    if (!reportData) return;

    memoryManager.current.addReportContext(reportData);
    
    // Add context message to UI
    const contextMessage: ChatMessage = {
      id: `report-context-${Date.now()}`,
      type: 'bot',
      content: `I can see you've shared your medical report: **${reportData.fileName}**. I have analyzed the report and I'm ready to discuss any questions you might have about your results. What would you like to know?`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, contextMessage]);
  };

  const sendMessage = async (content: string, messageType: 'symptom' | 'report_analysis' | 'general' = 'general') => {
    if (!content.trim()) return;

    setError(null);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add to memory
    memoryManager.current.addMessage({
      role: 'user',
      content: content.trim(),
      metadata: { messageType }
    });

    // Update user profile for symptoms
    if (messageType === 'symptom') {
      const currentProfile = memoryManager.current.getUserProfile();
      memoryManager.current.updateUserProfile({
        symptoms: [...(currentProfile?.symptoms || []), content.trim()],
        concerns: currentProfile?.concerns || [],
        preferences: currentProfile?.preferences || []
      });
    }

    try {
      setIsTyping(true);
      setIsLoading(true);

      // Get conversation history for LLM
      const conversationHistory = memoryManager.current.getMessagesForLLM();
      
      // Add context to the conversation based on report data and user profile
      const reportContext = memoryManager.current.getReportContext();
      const userProfile = memoryManager.current.getUserProfile();
      
      let contextualPrompt = content.trim();
      
      if (reportContext) {
        contextualPrompt += `\n\nContext: User has provided a medical report (${reportContext.fileName}). Report analysis: ${reportContext.analysis}`;
      }
      
      if (userProfile?.symptoms.length) {
        contextualPrompt += `\n\nUser's previously mentioned symptoms: ${userProfile.symptoms.join(', ')}`;
      }

      // Create the conversation with context
      const messagesForLLM: ConversationMessage[] = [
        ...conversationHistory,
        {
          id: `contextual-${Date.now()}`,
          role: 'user',
          content: contextualPrompt,
          timestamp: new Date()
        }
      ];

      // Generate LLM response
      const response = await llmService.current.generateResponse(messagesForLLM, {
        temperature: 0.7,
        maxTokens: 1000
      });

      // Add bot response
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Add to memory
      memoryManager.current.addMessage({
        role: 'assistant',
        content: response.content,
        metadata: { messageType }
      });

    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get response from AI');
      
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please check your API configuration and try again.",
        variant: "destructive"
      });

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: "I apologize, but I'm experiencing technical difficulties. Please check the API configuration and try again. In the meantime, I recommend consulting with a healthcare professional for any urgent concerns.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    memoryManager.current.clearSession();
    setMessages([]);
    setError(null);
    initializeChat();
  };

  const getProviderStatus = () => {
    return llmService.current.getAvailableProviders();
  };

  const switchProvider = (provider: string) => {
    try {
      llmService.current.setProvider(provider as any);
      toast({
        title: "Provider Switched",
        description: `Now using ${provider} as the AI provider.`
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const convertTochatMessage = (msg: ConversationMessage): ChatMessage => ({
    id: msg.id,
    type: msg.role === 'user' ? 'user' : 'bot',
    content: msg.content,
    timestamp: msg.timestamp
  });

  return {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    getProviderStatus,
    switchProvider,
    addReportContext
  };
};

export default useChat;
