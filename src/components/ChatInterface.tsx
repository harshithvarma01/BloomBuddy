import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Activity, FileText, Upload, Sparkles, Bot, User, Settings, AlertCircle, Stethoscope, Heart, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/use-chat';

// Enhanced Avatar Components
const AIAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`relative ${size}`}>
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white/20">
      <div className="relative">
        <Stethoscope className="w-5 h-5 text-white/90" />
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border border-white/50">
          <Heart className="w-1.5 h-1.5 text-white/80 absolute top-0.5 left-0.5" />
        </div>
      </div>
    </div>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
  </div>
);

const UserAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`relative ${size}`}>
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg border-2 border-white/20">
      <div className="relative">
        <User className="w-5 h-5 text-white/90" />
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border border-white/50">
          <div className="w-1 h-1 bg-white/80 rounded-full absolute top-0.5 left-0.5"></div>
        </div>
      </div>
    </div>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
  </div>
);

// Enhanced Header Avatar
const HeaderAvatar = () => (
  <div className="relative group">
    {/* Main Avatar Container */}
    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-2xl border-3 border-white/40 backdrop-blur-sm relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 animate-pulse opacity-60"></div>
      
      {/* Main Icon */}
      <div className="relative z-10">
        <Brain className="w-8 h-8 text-white drop-shadow-lg" />
        
        {/* Intelligence Indicator */}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg">
          <Zap className="w-3 h-3 text-white drop-shadow-sm" />
        </div>
      </div>
      
      {/* Sparkle Effects */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping"></div>
      <div className="absolute bottom-3 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-300"></div>
      
      {/* Rotating Ring */}
      <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r border-white/20 animate-spin" style={{ animationDuration: '8s' }}></div>
    </div>
    
    {/* Status Indicator */}
    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-xl">
      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
    </div>
    
    {/* Floating Elements */}
    <div className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-80 animate-bounce delay-150"></div>
    <div className="absolute -bottom-2 -left-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-70 animate-bounce delay-500"></div>
    
    {/* Glow Effect */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/40 to-blue-400/40 blur-lg scale-110 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
  </div>
);

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSymptomFlow: () => void;
  onReportFlow: () => void;
  initialReportData?: {
    fileName: string;
    analysis: string;
    uploadDate: string;
    fileType: string;
    fileSize: string;
  };
}

export const ChatInterface = ({ onSymptomFlow, onReportFlow, initialReportData }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showInitialOptions, setShowInitialOptions] = useState(!initialReportData);
  const [currentFlow, setCurrentFlow] = useState<'none' | 'symptoms' | 'reports'>(
    initialReportData ? 'reports' : 'none'
  );
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const { toast } = useToast();

  const {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    getProviderStatus,
    switchProvider
  } = useChat({ initialReportData });

  const handleSymptomFlow = () => {
    setShowInitialOptions(false);
    setCurrentFlow('symptoms');
    sendMessage('I only have symptoms', 'symptom');
  };

  const handleReportFlow = () => {
    setShowInitialOptions(false);
    setCurrentFlow('reports');
    sendMessage('I have test reports', 'report_analysis');
    onReportFlow();
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const messageType = currentFlow === 'symptoms' ? 'symptom' : 
                       currentFlow === 'reports' ? 'report_analysis' : 'general';
    
    sendMessage(inputValue, messageType);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const providerStatus = getProviderStatus();
  const hasConfiguredProvider = providerStatus.some(p => p.configured);

  return (
    <Card className="w-full max-w-5xl mx-auto h-[700px] modern-card animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="relative p-6 border-b border-white/20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-t-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-8 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute top-12 right-12 w-8 h-8 bg-white/5 rounded-full animate-float delay-300"></div>
            <div className="absolute bottom-8 left-16 w-6 h-6 bg-white/8 rounded-full animate-float delay-700"></div>
            <div className="absolute bottom-4 right-8 w-10 h-10 bg-white/6 rounded-full animate-float delay-1000"></div>
          </div>
          
          {/* Main Header Content */}
          <div className="relative z-10 flex items-center gap-5">
            <HeaderAvatar />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">BloomBuddy AI</h2>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Health Assistant</span>
                </div>
              </div>
              <p className="text-white/90 text-sm flex items-center gap-3 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                  <span className="drop-shadow-sm">
                    {hasConfiguredProvider 
                      ? 'Online • Ready to help with your health questions' 
                      : 'Configuration needed • Please set up API key'
                    }
                  </span>
                </div>
              </p>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProviderSettings(!showProviderSettings)}
                className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg"
              >
                <Settings className="w-5 h-5 drop-shadow-sm" />
              </Button>
              
              <div className="hidden sm:flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 shadow-xl">
                <div className="relative">
                  <Activity className="w-5 h-5 text-white/90 drop-shadow-sm" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <div className="h-4 w-px bg-white/30"></div>
                <span className="text-white/95 text-sm font-semibold tracking-wide drop-shadow-sm">AI Health Assistant</span>
              </div>
            </div>
          </div>

          {/* Enhanced Provider Settings */}
          {showProviderSettings && (
            <div className="relative z-10 mt-6 p-5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg tracking-wide drop-shadow-sm">AI Provider Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {providerStatus.map((provider) => (
                  <Button
                    key={provider.key}
                    size="sm"
                    variant="outline"
                    onClick={() => provider.configured && switchProvider(provider.key)}
                    disabled={!provider.configured}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                      provider.configured 
                        ? 'bg-white/20 border-white/40 text-white hover:bg-white/30 shadow-lg' 
                        : 'bg-white/5 border-white/20 text-white/60 cursor-not-allowed'
                    }`}
                  >
                    {provider.configured ? (
                      <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg animate-pulse" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 drop-shadow-sm" />
                    )}
                    <span className="drop-shadow-sm">{provider.name}</span>
                  </Button>
                ))}
              </div>
              
              {!hasConfiguredProvider && (
                <div className="mt-4 p-3 bg-amber-500/20 backdrop-blur-sm rounded-xl border border-amber-400/30">
                  <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                    💡 Configure API keys in your .env file to enable AI responses
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Error Display */}
          {error && (
            <div className="relative z-10 mt-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/40 rounded-2xl flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 bg-red-500/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-300 drop-shadow-sm" />
              </div>
              <span className="text-red-100 font-medium drop-shadow-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 bg-gradient-soft">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.type === 'user' ? (
                      <UserAvatar />
                    ) : (
                      <AIAvatar />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div
                    className={`p-4 rounded-2xl transition-spring hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-gradient-primary text-white shadow-card'
                        : 'bg-gradient-card border border-border/30 text-foreground shadow-soft'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-xs mt-2 block ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3">
                  <AIAvatar />
                  <div className="bg-gradient-card border border-border/30 p-4 rounded-2xl shadow-soft">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="ml-2 text-xs text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Initial Options */}
            {showInitialOptions && (
              <div className="flex justify-start animate-scale-in">
                <div className="max-w-[85%] flex gap-3">
                  <div className="flex-shrink-0">
                    <AIAvatar />
                  </div>
                  <div className="bg-gradient-card border border-border/30 p-6 rounded-2xl shadow-soft">
                    <p className="text-sm text-foreground mb-6 font-medium">
                      Please choose what best describes your situation:
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Button
                        onClick={handleSymptomFlow}
                        variant="outline"
                        disabled={!hasConfiguredProvider}
                        className="flex items-center gap-3 floating-card bg-white/50 hover:bg-white/70 border-primary/30 text-foreground font-medium px-6 py-3 h-auto"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">I have symptoms</div>
                          <div className="text-xs text-muted-foreground">Describe what you're feeling</div>
                        </div>
                      </Button>
                      <Button
                        onClick={handleReportFlow}
                        variant="outline"
                        className="flex items-center gap-3 floating-card bg-white/50 hover:bg-white/70 border-primary/30 text-foreground font-medium px-6 py-3 h-auto"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">I have test reports</div>
                          <div className="text-xs text-muted-foreground">Upload medical documents</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        {(currentFlow === 'symptoms' || currentFlow === 'reports') && (
          <div className="p-6 border-t border-border/30 bg-gradient-card rounded-b-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    currentFlow === 'symptoms' 
                      ? "Describe your symptoms in detail..." 
                      : currentFlow === 'reports'
                      ? "Ask questions about your medical report..."
                      : "Type your message..."
                  }
                  disabled={isLoading || !hasConfiguredProvider}
                  className="pl-4 pr-12 py-3 bg-white/70 border-primary/30 focus:border-primary transition-smooth rounded-xl text-foreground placeholder:text-muted-foreground"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !hasConfiguredProvider}
                className="bg-gradient-primary hover:opacity-90 transition-smooth px-6 py-3 rounded-xl shadow-glow"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {hasConfiguredProvider 
                ? "Press Enter to send • Be as detailed as possible for better insights"
                : "Configure an API key to enable AI chat functionality"
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
