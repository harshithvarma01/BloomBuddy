#!/bin/bash

# BloomBuddy LLM Setup Script
echo "🤖 BloomBuddy AI Health Companion - LLM Setup"
echo "============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "📋 .env file already exists"
fi

echo ""
echo "🔑 API Key Setup Instructions:"
echo ""
echo "Choose ONE provider to get started:"
echo ""

echo "1️⃣  OpenAI GPT (Recommended)"
echo "   • Visit: https://platform.openai.com/api-keys"
echo "   • Create account and generate API key"
echo "   • Add to .env: VITE_OPENAI_API_KEY=sk-your-key-here"
echo "   • Set: VITE_DEFAULT_LLM_PROVIDER=openai"
echo ""

echo "2️⃣  Anthropic Claude"
echo "   • Visit: https://console.anthropic.com/"
echo "   • Get API access and generate key"
echo "   • Add to .env: VITE_ANTHROPIC_API_KEY=your-key-here"
echo "   • Set: VITE_DEFAULT_LLM_PROVIDER=anthropic"
echo ""

echo "3️⃣  Google Gemini"
echo "   • Visit: https://makersuite.google.com/app/apikey"
echo "   • Generate API key"
echo "   • Add to .env: VITE_GOOGLE_API_KEY=your-key-here"
echo "   • Set: VITE_DEFAULT_LLM_PROVIDER=google"
echo ""

echo "⚠️  IMPORTANT:"
echo "   • Never commit .env file to version control"
echo "   • Keep your API keys secure"
echo "   • Monitor your API usage and costs"
echo ""

echo "🚀 After adding your API key:"
echo "   1. Save the .env file"
echo "   2. Restart the development server: npm run dev"
echo "   3. Navigate to the chat page to test"
echo ""

echo "📚 For detailed setup instructions, see: LLM_INTEGRATION_GUIDE.md"
