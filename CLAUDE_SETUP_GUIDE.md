# Setting Up Claude (Anthropic) for BloomBuddy

Claude by Anthropic is the recommended LLM for BloomBuddy due to its superior medical reasoning capabilities, safety focus, and nuanced understanding of healthcare contexts.

## Why Claude for Medical Applications?

- **Superior Reasoning**: Excellent at complex medical analysis and risk assessment
- **Safety-Focused**: Designed with careful consideration for sensitive medical advice
- **Context Understanding**: Better grasp of medical nuances and patient care
- **Evidence-Based**: Strong ability to provide medically sound recommendations
- **Risk Assessment**: Excellent at understanding and communicating health risks

## Getting Your Claude API Key

### 1. Sign Up for Anthropic
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Complete the verification process

### 2. Get API Access
1. Navigate to the API Keys section
2. Click "Create Key"
3. Copy your API key (starts with `sk-ant-`)
4. Store it securely

### 3. Add to BloomBuddy
Update your `.env` file:
```bash
VITE_ANTHROPIC_API_KEY=sk-ant-your_actual_api_key_here
```

## Claude Models Available

BloomBuddy is configured to use **Claude 3.5 Sonnet**, which offers:
- Excellent reasoning capabilities
- 200K context window
- Fast response times
- Superior medical knowledge

## Pricing (as of 2025)

Claude API pricing is very competitive and affordable:
- **Input**: $3 per million tokens
- **Output**: $15 per million tokens
- **New users**: Get $5 in free credits to start

For typical BloomBuddy usage:
- **Risk Assessment**: ~500-1000 tokens per analysis
- **Estimated Cost**: $0.01-0.02 per comprehensive health analysis
- **Monthly Usage**: For 100 assessments/month ≈ $1-2
- **Initial Credits**: $5 covers ~250-500 health assessments

**Note**: While Claude doesn't have a permanent free tier, the initial credits and low cost make it very accessible for development and testing.

## Configuration

BloomBuddy is pre-configured with optimal settings for medical use:

```typescript
// Optimized for medical recommendations
model: 'claude-3-5-sonnet-20241022'
maxTokens: 8000  // For comprehensive analysis
temperature: 0.1 // Low for consistent medical advice
timeout: 45000   // Extended for thorough analysis
```

## Benefits Over Other LLMs

| Feature | Claude | GPT-4 | Gemini |
|---------|--------|-------|--------|
| Medical Reasoning | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Safety Focus | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Context Understanding | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Risk Assessment | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Evidence-Based Advice | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## Testing Your Setup

After adding your API key:

1. **Start BloomBuddy**: `npm run dev`
2. **Test a prediction**: Use the prediction form
3. **Check quality**: Claude should provide:
   - Detailed, medically-sound recommendations
   - Appropriate urgency levels
   - Evidence-based suggestions
   - Clear next steps

## Fallback Options

If you prefer a free tier option or want alternatives:

**Free Options:**
- **Google Gemini**: Has a generous free tier (15 requests/minute)
- **OpenAI**: $18 in free credits for new users

**Recommended Approach:**
1. **Start with Claude**: Use the $5 free credits for testing and development
2. **For production**: Claude's superior medical reasoning justifies the low cost
3. **Alternative setup**: Configure Gemini as fallback for cost-conscious usage

But Claude remains the optimal choice for healthcare applications due to its medical expertise.

## Support

- **Anthropic Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **API Status**: [status.anthropic.com](https://status.anthropic.com)
- **Rate Limits**: Monitor in Anthropic console

## Security Note

- Never commit API keys to version control
- Use environment variables only
- Monitor usage in Anthropic console
- Consider rate limiting for production use
