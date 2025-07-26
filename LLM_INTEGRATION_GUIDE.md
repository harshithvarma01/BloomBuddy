# BloomBuddy AI Health Companion - LLM Integration

This document explains how to set up and use the LLM integration features in BloomBuddy.

## 🤖 LLM Integration Features

### ✅ Implemented Features:
- **Multi-Provider Support**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Conversation Memory**: Persistent chat history with context awareness
- **Report Context Integration**: AI can reference uploaded medical reports
- **User Profile Tracking**: Remembers symptoms and user preferences
- **Contextual Responses**: AI provides personalized insights based on conversation history
- **Error Handling**: Graceful fallbacks and configuration validation

## 🚀 Quick Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. API Key Configuration

Add your API keys to the `.env` file:

```bash
# Choose ONE provider to start with:

# Option 1: OpenAI (Recommended)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_DEFAULT_LLM_PROVIDER=openai

# Option 2: Anthropic Claude
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
VITE_DEFAULT_LLM_PROVIDER=anthropic

# Option 3: Google Gemini
VITE_GOOGLE_API_KEY=your-google-api-key-here
VITE_DEFAULT_LLM_PROVIDER=google
```

### 3. Obtain API Keys

#### OpenAI (Recommended)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up/login and create a new API key
3. Add billing information (pay-per-use)
4. Copy the API key to your `.env` file

#### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up and get access to Claude API
3. Generate an API key
4. Copy to your `.env` file

#### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy to your `.env` file

## 🎯 How It Works

### 1. **Conversation Memory**
- Stores up to 20 messages in browser localStorage
- Maintains context across page refreshes
- Tracks user symptoms and report data
- System prompts guide AI behavior

### 2. **Report Integration**
When a user uploads a medical report:
```typescript
// Report data is automatically passed to chat
const reportContext = {
  fileName: "Blood_Test_Results.pdf",
  analysis: "AI-generated analysis...",
  uploadDate: "2025-07-25",
  fileType: "PDF",
  fileSize: "2.1 MB"
};
```

### 3. **Contextual AI Responses**
The AI receives:
- Full conversation history
- Medical report analysis (if available)
- User's previous symptoms
- Appropriate medical disclaimers

### 4. **Provider Switching**
Users can switch between AI providers in real-time:
- Click the settings icon in chat header
- Select a configured provider
- Seamless transition between models

## 🔧 Advanced Configuration

### Custom Model Settings
Edit `src/lib/llm-config.ts`:

```typescript
export const llmConfig = {
  providers: {
    openai: {
      model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo'
      maxTokens: 4000
    },
    anthropic: {
      model: 'claude-3-sonnet-20240229', // or 'claude-3-haiku'
      maxTokens: 4000
    }
  }
};
```

### Memory Limits
Adjust conversation history limits:
```bash
VITE_MAX_CONVERSATION_HISTORY=20  # Number of messages to keep
VITE_CHAT_TIMEOUT_MS=30000       # API timeout in milliseconds
```

## 🎨 Usage Examples

### 1. **Symptom Discussion**
```
User: "I've been having headaches for 3 days"
AI: "I understand you're experiencing headaches. Based on your symptoms, here are some recommendations:

🩺 **Immediate Care:**
• Stay hydrated and get adequate rest
• Monitor your symptoms and note any changes
• Consider over-the-counter pain relievers if appropriate

🏥 **When to Seek Help:**
• If symptoms persist or worsen beyond a week
• If you develop fever or severe pain
• If you experience vision changes or nausea"
```

### 2. **Report Analysis Discussion**
```
User: "Can you explain what my cholesterol levels mean?"
AI: "Based on your uploaded blood test report, I can see your cholesterol results. Your total cholesterol is 220 mg/dL, which is slightly above the recommended level of <200 mg/dL.

Here's what this means:
• **Total Cholesterol**: 220 mg/dL (borderline high)
• **LDL**: Your 'bad' cholesterol level
• **HDL**: Your 'good' cholesterol level

**Recommendations:**
• Consider dietary changes (less saturated fat)
• Increase physical activity
• Discuss with your healthcare provider about management options"
```

## 🛡️ Safety Features

### Medical Disclaimers
All AI responses include appropriate disclaimers:
- "This is for informational purposes only"
- "Consult healthcare providers for medical advice"
- "Seek immediate help for emergencies"

### Privacy Protection
- Conversations stored locally only
- No data sent to third-party analytics
- API keys remain in browser environment
- Clear conversation option available

## 🐛 Troubleshooting

### Common Issues:

#### "API key not configured"
- Check `.env` file exists and has correct variable names
- Ensure no spaces around the `=` sign
- Restart development server after changes

#### "Failed to get response"
- Verify API key is valid and has credits/quota
- Check network connection
- Try switching to a different provider

#### "Rate limit exceeded"
- Wait a few minutes before trying again
- Consider upgrading your API plan
- Switch to a different provider temporarily

### Debug Mode
Enable detailed logging:
```typescript
// In browser console
localStorage.setItem('debug_llm', 'true');
```

## 🔄 Updates and Maintenance

### Adding New Providers
1. Update `src/lib/llm-config.ts` with new provider config
2. Add API call logic in `src/lib/llm-service.ts`
3. Update environment variables

### Model Updates
Providers regularly release new models. Update the `model` field in configuration files to use latest versions.

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Verify API key configuration
3. Test with a different provider
4. Check browser console for errors

Remember: This is a development setup. For production deployment, implement proper API key management and security measures.
