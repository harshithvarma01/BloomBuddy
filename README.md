# BloomBuddy - AI-Powered Health Companion

## 🌐 Live Application Status

[![Vercel](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://bloom-buddy-8bgkblggj-rdks-projects.vercel.app)
[![Railway](https://img.shields.io/badge/Backend-Live%20on%20Railway-success?style=for-the-badge&logo=railway)](https://web-production-1e69f.up.railway.app/api)

**🟢 LIVE & DEPLOYED** 
- **Frontend**: https://bloom-buddy-two.vercel.app/ (Vercel)
- **Backend API**: https://web-production-1e69f.up.railway.app/api (Railway)
- **Last Updated**: August 2025
- **Status**: ✅ Fully operational with navigation fixes applied

---

## 🏥 Project Overview

BloomBuddy is a comprehensive AI-powered health companion application that provides personalized health insights, risk analysis, and intelligent medical document processing. The platform combines machine learning models for disease prediction with advanced LLM integration for conversational health assistance and PDF medical report analysis.

## 📸 Demo Gallery

### 🏠 Main Dashboard
![BloomBuddy Dashboard](./docs/images/dashboard-demo.png)
*Intuitive main interface with health assessment options and AI chat access*

### 🤖 AI Chat Interface
![AI Chat Interface](./docs/images/chat-interface-demo.png)
*Conversational AI with multiple LLM providers and contextual health discussions*

### 📊 Health Risk Assessment
![Risk Assessment Form](./docs/images/risk-assessment-demo.png)
*Select your health assessment category: Heart Disease, Hypertension, Diabetes, or upload medical reports for comprehensive analysis*

![Risk Assessment Results](./docs/images/form.png)
*Detailed health questionnaire with medical parameters including age, blood pressure, cholesterol, ECG results, and cardiovascular indicators*

### 📋 Assessment Results
![Assessment Results](./docs/images/assessment-results-demo.png)
*Detailed risk analysis with AI-generated recommendations and actionable insights*

### 📄 PDF Report Analysis
![PDF Analysis](./docs/images/pdf-analysis-demo.png)
*Intelligent medical document processing with AI-powered insights*

### 💬 Chat About Results
![Chat Integration](./docs/images/chat-results-demo.png)
*Seamless integration allowing users to discuss assessment results with AI*

---

## ✨ Key Features

### 🤖 AI-Powered Health Analysis
- **Conversational AI**: Chat interface with multiple LLM providers (OpenAI, Anthropic Claude, Google Gemini)
- **Medical Report Processing**: Upload and analyze PDF medical reports with AI-powered insights
- **Contextual Memory**: Maintains conversation history and context across sessions
- **Post-Assessment Chat**: Discuss your health assessment results directly with the AI

### 📊 Machine Learning Predictions
- **Disease Risk Assessment**: Predictive models for diabetes, heart disease, and hypertension
- **Personalized Risk Scores**: ML-based risk percentage calculations with confidence levels
- **Evidence-Based Recommendations**: AI-generated health suggestions based on risk analysis
- **Interactive Results**: Navigate directly to chat interface to discuss findings

### 📄 Document Analysis
- **PDF Text Extraction**: Robust PDF parsing with metadata preservation
- **Medical Document Understanding**: Specialized AI prompts for medical analysis
- **Confidence Scoring**: Analysis confidence levels and document type classification

### 🛡️ Safety & Privacy
- **Medical Disclaimers**: Appropriate warnings and professional consultation recommendations
- **Local Processing**: PDF processing happens in browser for privacy
- **Secure API Integration**: Environment-based API key management

## 🚀 Quick Start

### Prerequisites
- **Node.js & npm** - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Python 3.9+** - For ML model server
- **API Keys** - For LLM providers (OpenAI, Anthropic, or Google)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/harshithvarma01/BloomBuddy.git
cd BloomBuddy

# 2. Install frontend dependencies
npm install

# 3. Install Python dependencies for ML models
pip install -r requirements.txt

# 4. Set up environment variables
# Copy the existing .env file and edit with your API keys
# See configuration section for details

# 5. Start the ML API server
python ml-api-server.py

# 6. Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 🎯 Key User Flows

1. **Health Assessment**: Select assessment category → Fill out health questionnaire → Get ML-powered risk analysis → Download PDF report
2. **Assessment Discussion**: Complete health assessment → Click "Chat About Report" → Automatic redirect to chat with assessment data loaded → Discuss results with AI
3. **Document Analysis**: Upload medical PDF → Get AI analysis → Chat about findings
4. **Direct Chat**: Access AI chat → Ask health questions → Get personalized responses

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with your API keys:

```bash
# LLM Provider (choose one or multiple)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
VITE_GOOGLE_API_KEY=your-google-api-key-here

# Default provider
VITE_DEFAULT_LLM_PROVIDER=anthropic

# ML API Configuration
# Environment configuration
VITE_ML_API_URL=http://localhost:5000/api  # For local development
# VITE_ML_API_URL=https://web-production-1e69f.up.railway.app/api  # For production

# Optional: Advanced settings
VITE_MAX_CONVERSATION_HISTORY=20
VITE_CHAT_TIMEOUT_MS=30000
```

### LLM Provider Setup

**Recommended: Anthropic Claude** (Superior medical reasoning)
- Visit [console.anthropic.com](https://console.anthropic.com)
- Generate API key and add to `.env`
- See [`CLAUDE_SETUP_GUIDE.md`](CLAUDE_SETUP_GUIDE.md) for detailed setup

**Alternative Providers:**
- **OpenAI**: [platform.openai.com](https://platform.openai.com/api-keys)
- **Google Gemini**: [makersuite.google.com](https://makersuite.google.com/app/apikey)

For detailed setup instructions, see [`LLM_INTEGRATION_GUIDE.md`](LLM_INTEGRATION_GUIDE.md)

### Machine Learning Models

1. **Prepare your ML models** in the `models/` directory:
```
models/
├── diabetes_model.pkl
├── diabetes_scaler.pkl
├── heart_model.pkl
├── heart_scaler.pkl
├── hypertension_model.pkl
└── hypertension_scaler.pkl
```

2. **Start the ML API server**:
```bash
python ml-api-server.py
```

For complete ML integration instructions, see [`ML_INTEGRATION_README.md`](ML_INTEGRATION_README.md)

## 🏗️ Architecture

### 🌐 Deployment Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                       Production Deployment                     │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Vercel)              Backend (Railway)               │
│  ┌─────────────────────┐       ┌─────────────────────┐          │
│  │  React + TypeScript │◄──────┤  Python Flask API   │          │
│  │  Vite Build         │       │  ML Models (pkl)    │          │
│  │  SPA Routing        │       │  Health Predictions │          │
│  │  CDN Distribution  │       │  CORS Configured    │           │
│  └─────────────────────┘       └─────────────────────┘          │
│                                                                 │
│  External APIs                                                  │
│  ┌─────────────────────┐                                        │
│  │  Anthropic Claude   │                                        │
│  │  OpenAI GPT         │                                        │
│  │  Google AI          │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 🔧 Technical Stack

### Frontend (React + TypeScript)
```
src/
├── components/          # UI components
│   ├── ui/             # shadcn-ui components
│   ├── ChatInterface.tsx
│   ├── FileUpload.tsx
│   └── PredictionForm.tsx
├── lib/                # Core utilities
│   ├── llm-service.ts  # LLM integration
│   ├── pdf-parser.ts   # PDF processing
│   └── medical-analyzer.ts
├── pages/              # Application pages
└── hooks/              # Custom React hooks
```

### Backend Services
- **ML API Server** (`ml-api-server.py`): Python Flask server for ML predictions
- **LLM Services**: Direct API integration with multiple providers
- **PDF Processing**: Client-side PDF parsing and analysis

### Technology Stack
- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **ML Backend**: Python, Flask, scikit-learn, pickle/joblib
- **AI Integration**: OpenAI, Anthropic, Google AI APIs
- **PDF Processing**: pdfjs-dist, pdf-parse
- **State Management**: React hooks, localStorage

## 📚 Documentation

### Setup Guides
- [`LLM_INTEGRATION_GUIDE.md`](LLM_INTEGRATION_GUIDE.md) - Complete LLM setup and configuration
- [`CLAUDE_SETUP_GUIDE.md`](CLAUDE_SETUP_GUIDE.md) - Detailed Claude/Anthropic setup
- [`ML_INTEGRATION_README.md`](ML_INTEGRATION_README.md) - Machine learning model integration
- [`PDF_ANALYSIS_GUIDE.md`](PDF_ANALYSIS_GUIDE.md) - PDF processing implementation

### Quick Setup Scripts
- [`setup-llm.sh`](setup-llm.sh) - Automated LLM configuration helper

## 🧪 Testing

### PDF Analysis Testing
```typescript
// Use built-in test utilities
import { PDFAnalysisTest } from './src/lib/pdf-test-utils';

// Generate test reports for debugging
const report = PDFAnalysisTest.generateTestReport(file, pdfResult, analysisResult);
```

### ML Model Testing
```bash
# Start ML server
python ml-api-server.py

# Test endpoints
curl -X POST http://localhost:5000/api/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{"features": [...]}'
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier-compatible** formatting
- **Component-based** architecture

## 🚢 Production Deployment

### 🌐 Live Application
- **Frontend**: https://bloom-buddy-two.vercel.app/
- **Backend API**: https://web-production-1e69f.up.railway.app/api

### ⚡ Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Build command (handled automatically by Vercel)
npm run build
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 🚂 ML API Deployment (Railway)
The ML backend is deployed using Railway's automatic deployment from GitHub:

```bash
# Railway handles deployment automatically
# Backend URL: https://web-production-1e69f.up.railway.app/api

# Production configuration
MODELS_DIR=./models
PORT=5000
DEBUG=false
```

**Railway Features**:
- ✅ Automatic deployments from GitHub
- ✅ Built-in HTTPS and domain management
- ✅ Environment variable management
- ✅ Health monitoring and logs

### 🔧 Environment Configuration
```bash
# Frontend (.env)
VITE_ML_API_URL=https://web-production-1e69f.up.railway.app/api
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_DEFAULT_LLM_PROVIDER=anthropic

# Backend (Railway Environment Variables)
MODELS_DIR=./models
PORT=5000
DEBUG=false
CORS_ORIGINS=https://bloom-buddy-two.vercel.app/
```

## 🛡️ Security & Privacy

### Data Protection
- **Local PDF Processing**: Files processed in browser
- **No Server Storage**: Documents not stored on servers
- **API Key Security**: Environment-based key management
- **Medical Disclaimers**: Appropriate health warnings

### Security Best Practices
- Never commit API keys to version control
- Use environment variables for sensitive data
- Monitor API usage and costs
- Implement rate limiting for production

## 🐛 Troubleshooting

### Common Issues

**API Key Problems:**
```bash
# Check .env file format
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here  # Correct
VITE_ANTHROPIC_API_KEY = sk-ant-your-key-here  # Wrong (spaces)
```

**PDF Analysis Issues:**
- Ensure LLM provider is configured
- Check file size (max 10MB)
- Verify PDF is not password protected

**ML Model Errors:**
- Confirm models are in `models/` directory
- Check that scalers match training preprocessing
- Verify Python dependencies are installed

### Debug Mode
```typescript
// Enable debug logging in browser
localStorage.setItem('debug_llm', 'true');
```

## 🚀 Quick Deployment Guide

### Deploy Your Own Instance

**1. Fork & Clone the Repository**
```bash
git clone https://github.com/your-username/BloomBuddy.git
cd BloomBuddy
```

**2. Deploy Backend to Railway**
- Connect your GitHub repo to Railway
- Railway will auto-detect the Python app
- Add environment variables: `MODELS_DIR=./models`
- Backend will be available at `https://your-app.up.railway.app`

**3. Deploy Frontend to Vercel** 
```bash
npm install -g vercel
vercel --prod
```
- Add environment variables in Vercel dashboard
- Update `VITE_ML_API_URL` with your Railway backend URL
- Frontend will be available at your Vercel domain

**4. Configure Environment Variables**
```bash
# Vercel Environment Variables
VITE_ML_API_URL=https://your-railway-app.up.railway.app/api
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
VITE_DEFAULT_LLM_PROVIDER=anthropic
```

**5. Test Your Deployment**
- Visit your Vercel domain
- Complete a health assessment
- Test the "Chat About Report" functionality
- Verify API connections are working

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation for changes
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **Setup Issues**: See individual setup guides
- **API Problems**: Check provider documentation
- **ML Integration**: Review [`ML_INTEGRATION_README.md`](ML_INTEGRATION_README.md)

### Getting Help
1. Check existing documentation
2. Verify API key configuration
3. Test with different providers
4. Check browser console for errors

---

**⚠️ Medical Disclaimer**: BloomBuddy is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.

**🔗 Links**: [LLM Setup](LLM_INTEGRATION_GUIDE.md) | [Claude Setup](CLAUDE_SETUP_GUIDE.md) | [ML Integration](ML_INTEGRATION_README.md) | [PDF Analysis](PDF_ANALYSIS_GUIDE.md)