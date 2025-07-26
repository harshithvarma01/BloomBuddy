export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    reportData?: any;
    messageType?: 'symptom' | 'report_analysis' | 'general';
    context?: string;
  };
}

export interface ConversationMemory {
  sessionId: string;
  messages: ConversationMessage[];
  reportContext?: {
    fileName: string;
    analysis: string;
    uploadDate: string;
    fileType: string;
    fileSize: string;
  };
  userProfile?: {
    symptoms: string[];
    concerns: string[];
    preferences: string[];
  };
  createdAt: Date;
  lastActivity: Date;
}

class ConversationMemoryManager {
  private memory: ConversationMemory | null = null;
  private maxMessages: number;

  constructor(maxMessages: number = 20) {
    this.maxMessages = maxMessages;
    this.loadFromStorage();
  }

  initializeSession(sessionId?: string): ConversationMemory {
    this.memory = {
      sessionId: sessionId || this.generateSessionId(),
      messages: [
        {
          id: '1',
          role: 'system',
          content: `You are BloomBuddy, an AI health companion designed to help users understand their health better. You provide personalized insights, analyze medical reports, and offer guidance on symptoms.

Key Guidelines:
- Always prioritize user safety and recommend professional medical consultation when appropriate
- Be empathetic, clear, and supportive in your responses
- Use the conversation context and any report data to provide personalized insights
- Remember previous discussions to maintain continuity
- Format responses clearly with bullet points, sections, and emojis when helpful
- Always include appropriate medical disclaimers

Remember: You are an AI assistant for informational purposes only and should not replace professional medical advice.`,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    this.saveToStorage();
    return this.memory;
  }

  addMessage(message: Omit<ConversationMessage, 'id' | 'timestamp'>): ConversationMessage {
    if (!this.memory) {
      this.initializeSession();
    }

    const newMessage: ConversationMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    };

    this.memory!.messages.push(newMessage);
    this.memory!.lastActivity = new Date();

    // Trim conversation if it exceeds max messages (keep system message)
    if (this.memory!.messages.length > this.maxMessages) {
      const systemMessage = this.memory!.messages[0];
      const recentMessages = this.memory!.messages.slice(-this.maxMessages + 1);
      this.memory!.messages = [systemMessage, ...recentMessages];
    }

    this.saveToStorage();
    return newMessage;
  }

  addReportContext(reportData: ConversationMemory['reportContext']): void {
    if (!this.memory) {
      this.initializeSession();
    }

    this.memory!.reportContext = reportData;
    
    // Add system message about the report context
    this.addMessage({
      role: 'system',
      content: `User has provided a medical report: ${reportData?.fileName}. Use this context in your responses. Report analysis: ${reportData?.analysis}`,
      metadata: {
        messageType: 'report_analysis',
        reportData
      }
    });
  }

  updateUserProfile(updates: Partial<ConversationMemory['userProfile']>): void {
    if (!this.memory) {
      this.initializeSession();
    }

    this.memory!.userProfile = {
      ...this.memory!.userProfile,
      ...updates
    } as ConversationMemory['userProfile'];

    this.saveToStorage();
  }

  getConversationHistory(): ConversationMessage[] {
    return this.memory?.messages || [];
  }

  getMessagesForLLM(): ConversationMessage[] {
    // Return messages excluding system metadata messages, but keep the initial system prompt
    return this.memory?.messages.filter((msg, index) => 
      index === 0 || (msg.role !== 'system' || !msg.metadata)
    ) || [];
  }

  getReportContext(): ConversationMemory['reportContext'] | undefined {
    return this.memory?.reportContext;
  }

  getUserProfile(): ConversationMemory['userProfile'] | undefined {
    return this.memory?.userProfile;
  }

  clearSession(): void {
    this.memory = null;
    localStorage.removeItem('bloombuddy_conversation');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    if (this.memory) {
      localStorage.setItem('bloombuddy_conversation', JSON.stringify(this.memory));
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('bloombuddy_conversation');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.lastActivity = new Date(parsed.lastActivity);
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.memory = parsed;
      }
    } catch (error) {
      console.warn('Failed to load conversation from storage:', error);
    }
  }
}

export default ConversationMemoryManager;
