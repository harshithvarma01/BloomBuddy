# BloomBuddy - AI-Powered Health Companion

## 🏥 Project Overview

BloomBuddy is a comprehensive AI-powered health companion application that provides personalized health insights, risk analysis, and intelligent medical document processing. The platform combines machine learning models for disease prediction with advanced LLM integration for conversational health assistance and PDF medical report analysis.

## ✨ Key Features

### 🤖 AI-Powered Health Analysis
- **Conversational AI**: Chat interface with multiple LLM providers (OpenAI, Anthropic Claude, Google Gemini)
- **Medical Report Processing**: Upload and analyze PDF medical reports with AI-powered insights
- **Contextual Memory**: Maintains conversation history and context across sessions

### 📊 Machine Learning Predictions
- **Disease Risk Assessment**: Predictive models for diabetes, heart disease, and hypertension
- **Personalized Risk Scores**: ML-based risk percentage calculations
- **Evidence-Based Recommendations**: AI-generated health suggestions based on risk analysis

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
git clone <YOUR_GIT_URL>
cd bloombuddy

# 2. Install frontend dependencies
npm install

# 3. Install Python dependencies for ML models
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see configuration section)

# 5. Start the ML API server (optional)
python ml-api-server.py

# 6. Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

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
VITE_ML_API_URL=http://localhost:5000/api

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

### Frontend Deployment
```bash
npm run build
# Deploy dist/ directory to your hosting provider
```

### ML API Deployment
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 ml-api-server:app

# Using Docker
docker build -t bloombuddy-ml .
docker run -p 5000:5000 bloombuddy-ml
```

### Environment Configuration
```bash
# Production environment variables
MODELS_DIR=./models
PORT=5000
DEBUG=false
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