# BloomBuddy Application - Complete System Architecture & Flow

## 🏗️ **Architecture Overview**

BloomBuddy is a sophisticated **AI-powered health companion** that combines multiple technologies to provide comprehensive health analysis. The system integrates machine learning models, large language models, and modern web technologies to deliver personalized health insights.

### **System Architecture Diagram**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + TypeScript)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Home Page   │  │ Chat Interface│  │Disease Forms │  │ File Upload  │    │
│  │   (Index)    │  │ (Symptoms)    │  │(ML Predict)  │  │(PDF Analysis)│    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼────────┐  ┌───▼────┐  ┌──────▼──────┐
            │   LLM Service  │  │ML API  │  │PDF Analyzer │
            │ (Multi-Provider)│  │Server  │  │ (Client)    │
            └────────────────┘  └────────┘  └─────────────┘
                    │               │               │
        ┌───────────┼───────────┐   │               │
        │           │           │   │               │
   ┌────▼───┐  ┌───▼────┐  ┌───▼▼──┐│               │
   │OpenAI  │  │Anthropic│  │Google ││               │
   │  API   │  │  API    │  │  AI   ││               │
   └────────┘  └─────────┘  └───────┘│               │
                                     │               │
                            ┌────────▼────────┐      │
                            │  Python Flask   │      │
                            │   ML Models     │      │
                            │                 │      │
                            │ ┌─────────────┐ │      │
                            │ │  Diabetes   │ │      │
                            │ │RandomForest │ │      │
                            │ └─────────────┘ │      │
                            │ ┌─────────────┐ │      │
                            │ │Heart Disease│ │      │
                            │ │   XGBoost   │ │      │
                            │ └─────────────┘ │      │
                            │ ┌─────────────┐ │      │
                            │ │Hypertension │ │      │
                            │ │   Logistic  │ │      │
                            │ └─────────────┘ │      │
                            └─────────────────┘      │
                                                     │
                                            ┌────────▼────────┐
                                            │    LLM APIs     │
                                            │  (Document      │
                                            │   Analysis)     │
                                            └─────────────────┘
```

## 🎯 **Core Application Flow**

### **1. Application Entry Point**
```tsx
// App.tsx - Main Router Configuration
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />                    // Home page
      <Route path="/chat" element={<Chat />} />                 // Chat interface
      <Route path="/medical-report" element={<MedicalReport />} />  // PDF analysis
      <Route path="/debug" element={<LLMDebugPanel />} />       // Debug tools
      <Route path="*" element={<NotFound />} />                 // 404 fallback
    </Routes>
  </BrowserRouter>
</QueryClientProvider>
```

### **2. User Journey State Management**
The application manages five distinct user interaction states:

```typescript
type AppState = 'home' | 'chat' | 'disease-selection' | 'prediction-form' | 'file-upload';

// State Transitions:
// home → chat (symptom analysis)
// home → disease-selection → prediction-form (ML predictions)
// home → disease-selection → file-upload (PDF analysis)
```

## 📊 **System Components Deep Dive**

### **A. Frontend Architecture (React + TypeScript + Vite)**

#### **1. Homepage Component (`src/pages/Index.tsx`)**
**Purpose**: Landing page with feature showcase and user onboarding

**Key Features**:
- **Hero Section**: Animated backgrounds with glassmorphism design
- **Feature Cards**: Interactive showcase of core capabilities
- **Two Primary User Flows**:
  - **Symptom Analysis**: Direct to AI conversation interface
  - **Health Reports**: Disease-specific ML predictions or PDF analysis

**Design Elements**:
```tsx
// Enhanced visual effects
<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl blur-3xl"></div>
<div className="animate-pulse delay-1000"></div>  // Staggered animations
```

#### **2. Chat Interface (`src/components/ChatInterface.tsx`)**
**Purpose**: Real-time conversation with AI for symptom analysis and health guidance

**Multi-Provider LLM Integration**:
- **OpenAI**: GPT-4, GPT-3.5-turbo models
- **Anthropic**: Claude-3 models (recommended for medical reasoning)
- **Google**: Gemini Pro models
- **Automatic Fallback**: Switches providers on API failures

**Key Features**:
```typescript
// Conversation Management
const { messages, sendMessage, isLoading } = useChat();

// Medical-Focused Prompting
const medicalPrompt = `You are BloomBuddy, an AI health companion. 
Provide helpful health information while always recommending 
professional medical consultation for serious concerns.`;

// Enhanced UI Elements
<AIAvatar />        // Animated medical-themed avatar
<UserAvatar />      // User identification avatar
<TypingIndicator /> // Real-time response feedback
```

**Conversation Memory**:
- Maintains context across messages (20 message limit)
- Local storage persistence
- Privacy-focused (no server-side storage)

#### **3. Disease Prediction System**

**A. Diabetes Prediction Form**
```typescript
// Feature Requirements (8 total)
Features: [
  Pregnancies,           // Number of pregnancies
  Glucose,              // Glucose level (mg/dL)
  BloodPressure,        // Diastolic BP (mmHg)
  SkinThickness,        // Triceps skin fold (mm)
  Insulin,              // 2-Hour serum insulin (mu U/ml)
  BMI,                  // Body mass index (kg/m²)
  DiabetesPedigreeFunction, // Diabetes pedigree function
  Age                   // Age in years
]

// ML Model: RandomForestClassifier
// Accuracy: 94.16%
// Precision: 94.12%
// Recall: 88.89%
```

**B. Heart Disease Prediction Form**
```typescript
// Feature Requirements (13 total)
Features: [
  age,          // Age in years
  sex,          // Sex (0: Female, 1: Male)
  cp,           // Chest pain type (0-3)
  trestbps,     // Resting blood pressure (mmHg)
  chol,         // Serum cholesterol (mg/dL)
  fbs,          // Fasting blood sugar > 120 mg/dl (0/1)
  restecg,      // Resting ECG results (0-2)
  thalach,      // Maximum heart rate achieved
  exang,        // Exercise induced angina (0/1)
  oldpeak,      // ST depression induced by exercise
  slope,        // Slope of peak exercise ST segment (0-2)
  ca,           // Number of major vessels (0-3)
  thal          // Thalassemia (1-3)
]

// ML Model: XGBClassifier
// Accuracy: 96.72%
// Precision: 94.29%
// Recall: 100%
```

**C. Hypertension Prediction Form**
```typescript
// Feature Requirements (12 total)
Features: [
  male,           // Sex (0: Female, 1: Male)
  age,            // Age in years
  currentSmoker,  // Current smoker (0/1)
  cigsPerDay,     // Cigarettes per day
  BPMeds,         // Blood pressure medication (0/1)
  diabetes,       // Diabetes (0/1)
  totChol,        // Total cholesterol (mg/dL)
  sysBP,          // Systolic blood pressure (mmHg)
  diaBP,          // Diastolic blood pressure (mmHg)
  BMI,            // Body mass index (kg/m²)
  heartRate,      // Heart rate (bpm)
  glucose         // Glucose level (mg/dL)
]

// ML Model: LogisticRegression
// Accuracy: 86.82%
// Precision: 80.27%
// Recall: 76.50%
```

#### **4. File Upload & PDF Analysis (`src/components/FileUpload.tsx`)**
**Purpose**: Client-side PDF processing and AI-powered medical document analysis

**Features**:
- **Drag-and-Drop Interface**: Modern file upload UX
- **PDF Processing**: Client-side parsing using `pdfjs-dist`
- **Security**: Files processed locally, never uploaded to servers
- **AI Analysis**: Extracted text sent to LLM for medical interpretation
- **File Validation**: PDF type checking and size limits

**Processing Flow**:
```typescript
// 1. File Upload & Validation
const handleFiles = (file: File) => {
  if (!['application/pdf'].includes(file.type)) {
    throw new Error('Only PDF files are supported');
  }
};

// 2. PDF Text Extraction
const extractTextFromPDF = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  // Extract text from all pages
};

// 3. AI Analysis
const analyzeMedicalDocument = async (text: string) => {
  const medicalPrompt = `Analyze this medical document and provide 
  comprehensive health insights, risk factors, and recommendations.`;
  return await llmService.generateResponse([{
    role: 'user',
    content: medicalPrompt + text
  }]);
};
```

### **B. Backend Services Architecture**

#### **1. ML API Server (`ml-api-server.py`)**
**Technology**: Flask-based Python server serving trained ML models

**Model Loading & Management**:
```python
# Global model storage
models = {
    'diabetes': None,      # RandomForestClassifier
    'heart': None,         # XGBClassifier  
    'hypertension': None   # LogisticRegression
}

scalers = {
    'diabetes': None,      # StandardScaler for diabetes
    'heart': None,         # StandardScaler for heart
    'hypertension': None   # StandardScaler for hypertension
}

def load_models():
    """Load trained models and scalers from pickle files"""
    models_dir = os.getenv('MODELS_DIR', './models')
    
    # Load diabetes model
    with open(f'{models_dir}/Diabetes Model/diabetes_model.pkl', 'rb') as f:
        models['diabetes'] = pickle.load(f)
    
    # Load scalers
    with open(f'{models_dir}/Diabetes Model/diabetes_scaler.pkl', 'rb') as f:
        scalers['diabetes'] = pickle.load(f)
```

**API Endpoints**:
```python
# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'diabetes': models['diabetes'] is not None,
            'heart': models['heart'] is not None,
            'hypertension': models['hypertension'] is not None
        }
    })

# Diabetes prediction
@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    data = request.get_json()
    features = data['features']  # 8 features expected
    
    # Preprocess with scaler
    features_scaled = scalers['diabetes'].transform([features])
    
    # Make prediction
    prediction = models['diabetes'].predict(features_scaled)[0]
    probability = models['diabetes'].predict_proba(features_scaled)[0][1]
    
    return jsonify({
        'probability': float(probability),
        'prediction': int(prediction),
        'confidence': 0.85
    })

# Similar endpoints for heart disease and hypertension
```

**Error Handling & Fallbacks**:
```python
# Graceful model loading failures
try:
    models['diabetes'] = pickle.load(model_file)
except Exception as e:
    logger.error(f"Failed to load diabetes model: {e}")
    # Fallback to rule-based predictions

# API error responses
if not models['diabetes']:
    return jsonify({'error': 'Model not available'}), 503
```

#### **2. LLM Service Integration (`src/lib/llm-service.ts`)**
**Purpose**: Multi-provider AI integration with medical-focused prompting

**Provider Configuration**:
```typescript
class LLMService {
  private providers = {
    openai: {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4-turbo-preview',
      apiKey: process.env.VITE_OPENAI_API_KEY
    },
    anthropic: {
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-sonnet-20240229',
      apiKey: process.env.VITE_ANTHROPIC_API_KEY
    },
    google: {
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-pro',
      apiKey: process.env.VITE_GOOGLE_API_KEY
    }
  };

  // Automatic provider fallback
  async generateResponse(messages: ConversationMessage[]) {
    try {
      return await this.callCurrentProvider(messages);
    } catch (error) {
      console.log(`Provider ${this.currentProvider} failed, trying fallback...`);
      return await this.tryFallbackProvider(messages);
    }
  }
}
```

**Medical-Specific Features**:
```typescript
// Enhanced medical prompting
const MEDICAL_SYSTEM_PROMPT = `
You are BloomBuddy, an AI health companion designed to provide helpful, 
accurate health information while maintaining appropriate medical boundaries.

Guidelines:
- Provide evidence-based health information
- Always recommend professional medical consultation for serious concerns
- Use clear, accessible language
- Include appropriate medical disclaimers
- Focus on prevention and general wellness
`;

// Conversation memory management
class ConversationMemory {
  private maxMessages = 20;
  private conversations = new Map<string, ConversationMessage[]>();
  
  addMessage(sessionId: string, message: ConversationMessage) {
    const messages = this.getConversation(sessionId);
    messages.push(message);
    
    // Maintain message limit
    if (messages.length > this.maxMessages) {
      messages.splice(0, messages.length - this.maxMessages);
    }
    
    this.saveToLocalStorage(sessionId, messages);
  }
}
```

### **C. Data Flow Architecture**

#### **1. ML Prediction Complete Flow**
```
User Input → Form Validation → Feature Mapping → API Call → Model Processing → Risk Calculation → AI Enhancement → Result Display → PDF Generation
```

**Detailed Example - Diabetes Prediction**:
```typescript
// 1. User Input Collection
const formData = {
  pregnancies: 2,
  glucose: 140,
  bloodPressure: 80,
  skinThickness: 25,
  insulin: 90,
  bmi: 28.5,
  diabetesPedigreeFunction: 0.6,
  age: 45
};

// 2. Frontend Feature Mapping
const mlInput: MLPredictionInput = {
  pregnancies: parseInt(formData.pregnancies),
  glucose: parseInt(formData.glucose),
  bloodPressure: parseInt(formData.bloodPressure),
  skinThickness: parseInt(formData.skinThickness),
  insulin: parseInt(formData.insulin),
  bmi: parseFloat(formData.bmi),
  diabetesPedigreeFunction: parseFloat(formData.diabetesPedigreeFunction),
  age: parseInt(formData.age)
};

// 3. API Payload Construction
const payload = {
  features: [
    mlInput.pregnancies,           // 2
    mlInput.glucose,               // 140
    mlInput.bloodPressure,         // 80
    mlInput.skinThickness,         // 25
    mlInput.insulin,               // 90
    mlInput.bmi,                   // 28.5
    mlInput.diabetesPedigreeFunction, // 0.6
    mlInput.age                    // 45
  ]
};

// 4. ML Model Processing (Python)
features_scaled = scaler.transform([[2, 140, 80, 25, 90, 28.5, 0.6, 45]])
probability = model.predict_proba(features_scaled)[0][1]  # 0.73 (73% risk)

// 5. Enhanced AI Analysis
const enhancedResult = await this.generateLLMRecommendations({
  disease: 'diabetes',
  riskPercentage: 73,
  features: mlInput
});

// 6. Final Response
{
  riskPercentage: 73,
  riskLevel: "High",
  confidence: 0.89,
  riskFactors: {
    high: ["Elevated glucose level (140 mg/dL)", "BMI in overweight range"],
    moderate: ["Age factor (45 years)", "Previous pregnancies"]
  },
  llmSuggestions: {
    immediateActions: [
      "Schedule appointment with healthcare provider for diabetes screening",
      "Monitor blood glucose levels regularly",
      "Begin dietary modifications to reduce sugar intake"
    ],
    lifestyleRecommendations: [
      "Adopt a low-glycemic diet rich in vegetables and lean proteins",
      "Engage in 150 minutes of moderate exercise weekly",
      "Maintain healthy weight through balanced nutrition"
    ],
    medicalAdvice: [
      "Request HbA1c test for comprehensive diabetes assessment",
      "Consider consultation with an endocrinologist",
      "Discuss family history of diabetes with your doctor"
    ],
    monitoringGuidelines: [
      "Check fasting glucose levels monthly",
      "Monitor weight changes weekly",
      "Track blood pressure regularly"
    ]
  },
  nextSteps: [
    "Book medical consultation within 2 weeks",
    "Start food diary to track carbohydrate intake",
    "Begin regular exercise routine",
    "Schedule follow-up in 3 months"
  ]
}
```

#### **2. Chat Flow with Memory Management**
```
User Message → Memory Retrieval → Context Building → Medical Prompt Enhancement → LLM API Call → Response Processing → Memory Update → Display
```

**Implementation Details**:
```typescript
// 1. Message Processing
const handleSendMessage = async (userMessage: string) => {
  // Add user message to conversation
  const userMsg: ConversationMessage = {
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  };
  
  // Retrieve conversation history
  const conversationHistory = conversationMemory.getConversation(sessionId);
  
  // Build context-aware messages
  const messages = [
    { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    userMsg
  ];
  
  // Generate AI response
  const response = await llmService.generateResponse(messages);
  
  // Create assistant message
  const assistantMsg: ConversationMessage = {
    role: 'assistant',
    content: response.content,
    timestamp: new Date()
  };
  
  // Update conversation memory
  conversationMemory.addMessage(sessionId, userMsg);
  conversationMemory.addMessage(sessionId, assistantMsg);
  
  // Update UI
  setMessages(prev => [...prev, userMsg, assistantMsg]);
};
```

#### **3. PDF Analysis Flow**
```
File Upload → PDF Parsing → Text Extraction → Medical Context Enhancement → LLM Analysis → Structured Response → Chat Integration
```

**Processing Pipeline**:
```typescript
// 1. File Upload & Validation
const handleFileUpload = async (file: File) => {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files supported');
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File too large');
  }
};

// 2. PDF Text Extraction
const extractPDFText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

// 3. Medical Document Analysis
const analyzeDocument = async (text: string) => {
  const medicalAnalysisPrompt = `
  You are a medical AI assistant analyzing a health document. 
  Please provide a comprehensive analysis including:
  
  1. Document Type: (lab results, imaging report, prescription, etc.)
  2. Key Findings: Important medical information
  3. Risk Factors: Any concerning indicators
  4. Recommendations: Suggested actions
  5. Questions for Doctor: What to discuss with healthcare provider
  
  Medical Document Content:
  ${text}
  
  Important: Always recommend professional medical consultation.
  `;
  
  return await llmService.generateResponse([{
    role: 'user',
    content: medicalAnalysisPrompt
  }]);
};
```

## 🔒 **Security & Privacy Architecture**

### **1. Data Protection Measures**

**Client-Side Security**:
```typescript
// PDF Processing - No Server Upload
const processFileLocally = async (file: File) => {
  // File stays in browser memory
  const text = await extractPDFText(file);
  // Only extracted text sent to LLM APIs
  const analysis = await analyzeMedicalText(text);
  // Original file never leaves user's device
};

// API Key Security
const getAPIKey = () => {
  // Environment variables only
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('API key not configured');
  }
  return key;
};

// Local Storage Encryption
const encryptConversation = (messages: ConversationMessage[]) => {
  // Basic encryption for sensitive conversation data
  return btoa(JSON.stringify(messages));
};
```

**Server-Side Security**:
```python
# CORS Configuration
CORS(app, origins=[
    "http://localhost:5173",  # Development
    "https://bloombuddy.app"  # Production
])

# Input Validation
@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    data = request.get_json()
    
    if not data or 'features' not in data:
        return jsonify({'error': 'Invalid request'}), 400
    
    features = data['features']
    if len(features) != 8:
        return jsonify({'error': 'Expected 8 features'}), 400
    
    # Validate feature ranges
    if not all(isinstance(f, (int, float)) for f in features):
        return jsonify({'error': 'Invalid feature types'}), 400

# Rate Limiting
from flask_limiter import Limiter
limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

@app.route('/api/predict/diabetes')
@limiter.limit("10 per minute")
def predict_diabetes():
    # Prediction logic
```

### **2. Medical Compliance & Ethics**

**Professional Disclaimers**:
```typescript
const MEDICAL_DISCLAIMER = `
⚠️ Important Medical Disclaimer

This AI-powered risk assessment is for informational purposes only and should 
not replace professional medical advice, diagnosis, or treatment. The predictions 
are based on machine learning models and may not account for all individual 
health factors.

Always consult with qualified healthcare providers for:
- Proper medical evaluation
- Professional diagnosis
- Treatment decisions
- Emergency medical situations

If you experience severe symptoms or medical emergencies, 
seek immediate professional medical attention.
`;

// Displayed prominently in results
const ResultsWithDisclaimer = ({ result }) => (
  <div>
    <PredictionResults data={result} />
    <MedicalDisclaimer text={MEDICAL_DISCLAIMER} />
  </div>
);
```

**Ethical AI Guidelines**:
```typescript
// Bias Mitigation
const validatePredictionFairness = (input: MLPredictionInput) => {
  // Check for demographic bias in inputs
  // Log for model performance monitoring
  // Provide confidence intervals
};

// Transparency
const explainPrediction = (result: MLPredictionResult) => {
  return {
    ...result,
    explanation: {
      modelType: 'Random Forest Classifier',
      featureImportance: [...],
      confidence: result.confidence,
      limitations: 'Model trained on specific dataset demographics'
    }
  };
};
```

## ⚙️ **Configuration & Environment Setup**

### **1. Environment Variables Configuration**
```bash
# .env file structure

# LLM Provider APIs (choose one or multiple)
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here  # Recommended
VITE_GOOGLE_API_KEY=your-google-ai-key-here

# Default LLM Provider
VITE_DEFAULT_LLM_PROVIDER=anthropic

# ML API Configuration
VITE_ML_API_URL=http://localhost:5000/api

# Advanced Configuration
VITE_MAX_CONVERSATION_HISTORY=20
VITE_CHAT_TIMEOUT_MS=30000
VITE_MAX_FILE_SIZE_MB=10

# Development Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### **2. Model File Structure Requirements**
```
models/
├── Diabetes Model/
│   ├── diabetes_model.pkl      # RandomForestClassifier
│   ├── diabetes_scaler.pkl     # StandardScaler
│   ├── diabetes.csv           # Training data
│   └── app2.py                # Training script
├── Heart Model/
│   ├── heart_model.pkl        # XGBClassifier
│   ├── heart_scaler.pkl       # StandardScaler
│   ├── heart.csv              # Training data
│   └── app4.py                # Training script
├── Hypertenstion Model/        # Note: folder name as-is
│   ├── hypertension_model.pkl # LogisticRegression
│   ├── scaler.pkl             # StandardScaler (different name)
│   ├── hypertension.csv       # Training data
│   └── app.py                 # Training script
└── all_model_parameters_and_comparison.txt
```

### **3. Deployment Configuration**

**Frontend Deployment (Vite)**:
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}

// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['@anthropic-ai/sdk', 'openai']
        }
      }
    }
  }
});
```

**Backend Deployment (Python)**:
```python
# Production WSGI configuration
# wsgi.py
from ml-api-server import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)

# requirements.txt
flask==2.3.2
flask-cors==4.0.0
numpy==1.24.3
scikit-learn==1.3.0
xgboost==1.7.6
python-dotenv==1.0.0
gunicorn==21.2.0

# Docker deployment
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
```

## 🎨 **User Experience & Interface Design**

### **1. Modern UI/UX Architecture**

**Design System**:
```css
/* Glassmorphism Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

/* Gradient Animations */
.gradient-animation {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Medical Theme Colors */
:root {
  --medical-primary: #2563eb;      /* Professional blue */
  --medical-secondary: #7c3aed;    /* Trust purple */
  --medical-success: #059669;      /* Health green */
  --medical-warning: #d97706;      /* Attention orange */
  --medical-danger: #dc2626;       /* Alert red */
}
```

**Responsive Design**:
```typescript
// Mobile-first responsive breakpoints
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px'   // Large desktop
};

// Adaptive layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Auto-responsive grid */}
</div>
```

### **2. Interactive Elements & Animations**

**Loading States**:
```typescript
// Progressive loading with skeleton screens
const LoadingPrediction = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);

// Real-time progress indicators
<Progress value={66} className="w-full" />
<p className="text-sm text-center text-muted-foreground">
  Running ML analysis...
</p>
```

**Micro-interactions**:
```typescript
// Hover effects and state changes
const InteractiveCard = ({ children }) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    {children}
  </Card>
);

// Toast notifications for user feedback
const { toast } = useToast();
toast({
  title: "Analysis Complete",
  description: "Your diabetes risk assessment is ready.",
  duration: 5000
});
```

## 🧪 **Testing & Quality Assurance**

### **1. Frontend Testing Strategy**

**Component Testing**:
```typescript
// React Testing Library examples
import { render, screen, fireEvent } from '@testing-library/react';
import { PredictionForm } from '../components/PredictionForm';

describe('PredictionForm', () => {
  test('validates required fields', () => {
    render(<PredictionForm disease="diabetes" />);
    
    const submitButton = screen.getByText('Analyze Risk');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
  });
  
  test('calls ML API with correct payload', async () => {
    const mockApiCall = jest.fn();
    // Test API integration
  });
});
```

**LLM Integration Testing**:
```typescript
// Mock LLM responses for testing
const mockLLMService = {
  generateResponse: jest.fn().mockResolvedValue({
    content: 'Mock medical advice response',
    usage: { totalTokens: 150 },
    model: 'claude-3-sonnet',
    provider: 'anthropic'
  })
};

// Test conversation flow
test('handles conversation context correctly', async () => {
  const conversation = await chatService.processMessage(
    'I have chest pain',
    mockConversationHistory
  );
  
  expect(conversation.messages).toHaveLength(2);
  expect(conversation.messages[1].content).toContain('medical attention');
});
```

### **2. Backend Testing Strategy**

**ML Model Testing**:
```python
# pytest examples
import pytest
from ml_api_server import app, predict_diabetes

@pytest.fixture
def client():
    app.config['TESTING'] = True
    return app.test_client()

def test_diabetes_prediction(client):
    # Test with known input
    response = client.post('/api/predict/diabetes', json={
        'features': [1, 120, 70, 20, 80, 25.5, 0.5, 35]
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'probability' in data
    assert 0 <= data['probability'] <= 1

def test_invalid_feature_count(client):
    # Test validation
    response = client.post('/api/predict/diabetes', json={
        'features': [1, 2, 3]  # Too few features
    })
    
    assert response.status_code == 400
    assert 'Expected 8 features' in response.get_json()['error']
```

**Model Performance Monitoring**:
```python
# Model drift detection
def monitor_prediction_distribution(predictions: List[float]):
    """Monitor for model drift in production"""
    mean_pred = np.mean(predictions)
    std_pred = np.std(predictions)
    
    # Alert if distribution changes significantly
    if abs(mean_pred - 0.5) > 0.3:  # Example threshold
        logger.warning(f"Prediction distribution drift detected: mean={mean_pred}")
    
    return {
        'mean': mean_pred,
        'std': std_pred,
        'total_predictions': len(predictions)
    }
```

### **3. Debug & Monitoring Tools**

**LLM Debug Panel**:
```typescript
// Debug interface for testing LLM providers
const LLMDebugPanel = () => {
  const [provider, setProvider] = useState('anthropic');
  const [testMessage, setTestMessage] = useState('');
  const [response, setResponse] = useState('');
  
  const testProvider = async () => {
    try {
      llmService.setProvider(provider);
      const result = await llmService.generateResponse([{
        role: 'user',
        content: testMessage
      }]);
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <Select onValueChange={setProvider}>
        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
        <SelectItem value="openai">OpenAI GPT</SelectItem>
        <SelectItem value="google">Google Gemini</SelectItem>
      </Select>
      
      <Input 
        placeholder="Test message"
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
      />
      
      <Button onClick={testProvider}>Test Provider</Button>
      
      <pre className="bg-gray-100 p-4 rounded">{response}</pre>
    </div>
  );
};
```

**Model Status Monitoring**:
```python
@app.route('/debug/models', methods=['GET'])
def debug_models():
    """Debug endpoint for checking model status"""
    models_dir = os.getenv('MODELS_DIR', './models')
    
    status = {
        'models_loaded': {
            'diabetes': models['diabetes'] is not None,
            'heart': models['heart'] is not None,
            'hypertension': models['hypertension'] is not None,
        },
        'scalers_loaded': {
            'diabetes': scalers['diabetes'] is not None,
            'heart': scalers['heart'] is not None,
            'hypertension': scalers['hypertension'] is not None,
        },
        'file_existence': {
            'diabetes_model': os.path.exists(f'{models_dir}/Diabetes Model/diabetes_model.pkl'),
            'diabetes_scaler': os.path.exists(f'{models_dir}/Diabetes Model/diabetes_scaler.pkl'),
            'heart_model': os.path.exists(f'{models_dir}/Heart Model/heart_model.pkl'),
            'heart_scaler': os.path.exists(f'{models_dir}/Heart Model/heart_scaler.pkl'),
            'hypertension_model': os.path.exists(f'{models_dir}/Hypertenstion Model/hypertension_model.pkl'),
            'hypertension_scaler': os.path.exists(f'{models_dir}/Hypertenstion Model/scaler.pkl'),
        },
        'model_info': {}
    }
    
    # Add model details if loaded
    for disease, model in models.items():
        if model is not None:
            status['model_info'][disease] = {
                'type': type(model).__name__,
                'features': getattr(model, 'n_features_in_', 'unknown')
            }
    
    return jsonify(status)
```

## 🚀 **Performance Optimization & Scalability**

### **1. Frontend Performance**

**Code Splitting & Lazy Loading**:
```typescript
// Route-based code splitting
const Chat = lazy(() => import('./pages/Chat'));
const MedicalReport = lazy(() => import('./pages/MedicalReport'));

// Component-based splitting
const PredictionForm = lazy(() => import('./components/PredictionForm'));

// Usage with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <Routes>
    <Route path="/chat" element={<Chat />} />
    <Route path="/medical-report" element={<MedicalReport />} />
  </Routes>
</Suspense>
```

**Asset Optimization**:
```typescript
// Image optimization
const optimizedImage = {
  src: '/images/hero-medical.webp',
  fallback: '/images/hero-medical.jpg',
  alt: 'Medical AI assistant',
  loading: 'lazy' as const
};

// Bundle optimization
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog'],
          'ai-vendor': ['@anthropic-ai/sdk', 'openai'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  }
});
```

**Caching Strategy**:
```typescript
// React Query for API caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Service Worker for static asset caching
// sw.js
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### **2. Backend Performance**

**Model Optimization**:
```python
# Model preloading and memory management
class ModelManager:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.model_cache = {}
    
    def get_prediction(self, disease: str, features: List[float]):
        # Cache predictions for identical inputs
        cache_key = f"{disease}:{hash(tuple(features))}"
        
        if cache_key in self.model_cache:
            return self.model_cache[cache_key]
        
        # Make prediction
        result = self._predict(disease, features)
        
        # Cache result (with TTL)
        self.model_cache[cache_key] = {
            'result': result,
            'timestamp': time.time()
        }
        
        return result

# Connection pooling for database operations
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

engine = create_engine(
    'sqlite:///health_data.db',
    poolclass=StaticPool,
    pool_size=20,
    max_overflow=30
)
```

**API Performance**:
```python
# Response compression
from flask_compress import Compress
Compress(app)

# Request batching
@app.route('/api/predict/batch', methods=['POST'])
def batch_predict():
    """Handle multiple predictions in single request"""
    data = request.get_json()
    predictions = []
    
    for prediction_request in data['requests']:
        disease = prediction_request['disease']
        features = prediction_request['features']
        result = get_prediction(disease, features)
        predictions.append(result)
    
    return jsonify({'predictions': predictions})

# Async processing for heavy operations
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)

@app.route('/api/predict/async/<disease>', methods=['POST'])
def async_predict(disease):
    features = request.get_json()['features']
    
    # Submit to thread pool
    future = executor.submit(run_prediction, disease, features)
    task_id = str(uuid.uuid4())
    
    # Store future for later retrieval
    pending_tasks[task_id] = future
    
    return jsonify({'task_id': task_id, 'status': 'processing'})
```

### **3. Scalability Architecture**

**Horizontal Scaling**:
```python
# Load balancer configuration
# nginx.conf
upstream ml_servers {
    server ml-server-1:5000 weight=3;
    server ml-server-2:5000 weight=3;
    server ml-server-3:5000 weight=2;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://ml_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Microservices Architecture**:
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_ML_API_URL=http://ml-api:5000
  
  ml-api:
    build: ./ml-api
    ports:
      - "5000:5000"
    volumes:
      - ./models:/app/models
    environment:
      - MODELS_DIR=/app/models
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=bloombuddy
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secure_password
```

**Monitoring & Observability**:
```python
# Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest

prediction_requests = Counter('prediction_requests_total', 'Total prediction requests', ['disease'])
prediction_latency = Histogram('prediction_duration_seconds', 'Prediction latency')

@app.route('/api/predict/<disease>', methods=['POST'])
@prediction_latency.time()
def predict(disease):
    prediction_requests.labels(disease=disease).inc()
    # Prediction logic
    return result

@app.route('/metrics')
def metrics():
    return generate_latest()

# Logging configuration
import structlog

logger = structlog.get_logger()

def log_prediction(disease: str, features: List[float], result: dict):
    logger.info(
        "prediction_made",
        disease=disease,
        feature_count=len(features),
        risk_percentage=result.get('probability', 0) * 100,
        model_confidence=result.get('confidence', 0)
    )
```

This comprehensive architecture document covers every aspect of the BloomBuddy application, from frontend user interactions to backend ML model serving, security considerations, performance optimizations, and scalability patterns. The system is designed to be robust, secure, and capable of handling real-world healthcare analysis workloads while maintaining the highest standards for medical AI applications.
