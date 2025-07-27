import LLMService from './llm-service';

export interface MLPredictionInput {
  // Common fields
  age: number;
  
  // Diabetes specific - exactly matching your diabetes.csv columns
  pregnancies?: number;
  glucose?: number;
  bloodPressure?: number;
  skinThickness?: number;
  insulin?: number;
  bmi?: number;
  diabetesPedigreeFunction?: number;
  
  // Heart Disease specific - exactly matching your heart.csv columns
  sex?: number; // 0: Female, 1: Male
  chestPainType?: number; // cp: 0-3
  restingBP?: number; // trestbps
  cholesterol?: number; // chol
  fastingBS?: number; // fbs: 0: <120mg/dl, 1: >120mg/dl
  restingECG?: number; // restecg: 0-2
  maxHR?: number; // thalach
  exerciseAngina?: number; // exang: 0: No, 1: Yes
  oldpeak?: number;
  stSlope?: number; // slope: 0-2
  ca?: number; // major vessels: 0-3
  thal?: number; // thalassemia: 1-3
  
  // Hypertension specific - exactly matching your hypertension.csv columns
  smoking?: number; // currentSmoker: 0: No, 1: Yes
  cigsPerDay?: number;
  BPMeds?: number; // 0: No, 1: Yes
  diabetes?: number; // 0: No, 1: Yes
  totChol?: number; // total cholesterol
  systolicBP?: number; // sysBP
  diastolicBP?: number; // diaBP
  heartRate?: number; // heart rate
  
  // Legacy fields for backward compatibility
  alcohol?: number;
  exercise?: number;
  familyHistory?: number;
  stress?: number;
}

export interface MLPredictionResult {
  disease: 'diabetes' | 'heart' | 'hypertension';
  riskPercentage: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  features: Record<string, number>;
}

export interface EnhancedPredictionResult extends MLPredictionResult {
  llmSuggestions: {
    immediateActions: string[];
    lifestyleRecommendations: string[];
    medicalAdvice: string[];
    preventiveMeasures: string[];
    monitoringGuidelines: string[];
  };
  riskFactors: {
    high: string[];
    moderate: string[];
    low: string[];
  };
  nextSteps: string[];
}

class MLPredictionService {
  private llmService: LLMService;
  private apiBaseUrl: string;

  constructor() {
    this.llmService = new LLMService();
    // You'll need to replace this with your actual ML model API endpoint
    this.apiBaseUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000/api';
  }

  /**
   * Predict diabetes risk using your trained model
   * Features: [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]
   */
  async predictDiabetes(input: MLPredictionInput): Promise<MLPredictionResult> {
    const payload = {
      features: [
        input.pregnancies || 0,                    // Pregnancies
        input.glucose || 100,                      // Glucose
        input.bloodPressure || 70,                 // BloodPressure
        input.skinThickness || 20,                 // SkinThickness
        input.insulin || 80,                       // Insulin
        input.bmi || 25,                          // BMI
        input.diabetesPedigreeFunction || 0.5,     // DiabetesPedigreeFunction
        input.age                                  // Age
      ]
    };

    try {
      const response = await fetch(`${this.apiBaseUrl}/predict/diabetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        disease: 'diabetes',
        riskPercentage: Math.round(result.probability * 100),
        riskLevel: this.getRiskLevel(result.probability * 100),
        confidence: result.confidence || 0.85,
        features: {
          pregnancies: input.pregnancies || 0,
          glucose: input.glucose || 100,
          bloodPressure: input.bloodPressure || 70,
          skinThickness: input.skinThickness || 20,
          insulin: input.insulin || 80,
          bmi: input.bmi || 25,
          diabetesPedigreeFunction: input.diabetesPedigreeFunction || 0.5,
          age: input.age
        }
      };
    } catch (error) {
      console.error('Diabetes prediction error:', error);
      // Fallback prediction for demo purposes
      return this.getFallbackPrediction('diabetes', input);
    }
  }

  /**
   * Predict heart disease risk using your trained model
   */
  async predictHeartDisease(input: MLPredictionInput): Promise<MLPredictionResult> {
    const payload = {
      features: [
        input.age,                                 // age
        input.sex || 1,                           // sex (0: Female, 1: Male)
        input.chestPainType || 0,                 // cp (chest pain type)
        input.restingBP || 120,                   // trestbps (resting blood pressure)
        input.cholesterol || 200,                 // chol (cholesterol)
        input.fastingBS || 0,                     // fbs (fasting blood sugar > 120 mg/dl)
        input.restingECG || 0,                    // restecg (resting ECG)
        input.maxHR || 150,                       // thalach (max heart rate achieved)
        input.exerciseAngina || 0,                // exang (exercise induced angina)
        input.oldpeak || 0,                       // oldpeak (ST depression)
        input.stSlope || 1,                       // slope (peak exercise ST slope)
        input.ca || 0,                            // ca (number of major vessels)
        input.thal || 1                           // thal (thalassemia)
      ]
    };

    try {
      const response = await fetch(`${this.apiBaseUrl}/predict/heart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        disease: 'heart',
        riskPercentage: Math.round(result.probability * 100),
        riskLevel: this.getRiskLevel(result.probability * 100),
        confidence: result.confidence || 0.88,
        features: {
          age: input.age,
          sex: input.sex || 1,
          chestPainType: input.chestPainType || 0,
          restingBP: input.restingBP || 120,
          cholesterol: input.cholesterol || 200,
          maxHR: input.maxHR || 150
        }
      };
    } catch (error) {
      console.error('Heart disease prediction error:', error);
      return this.getFallbackPrediction('heart', input);
    }
  }

  /**
   * Predict hypertension risk using your trained model
   * Features: [male, age, currentSmoker, cigsPerDay, BPMeds, diabetes, totChol, sysBP, diaBP, BMI, heartRate, glucose]
   */
  async predictHypertension(input: MLPredictionInput): Promise<MLPredictionResult> {
    const payload = {
      features: [
        input.sex || 0,                           // male (0: Female, 1: Male)
        input.age,                                // age
        input.smoking || 0,                       // currentSmoker
        input.cigsPerDay || 0,                   // cigsPerDay
        input.BPMeds || 0,                       // BPMeds
        input.diabetes || 0,                     // diabetes
        input.totChol || 200,                    // totChol
        input.systolicBP || 120,                 // sysBP
        input.diastolicBP || 80,                 // diaBP
        input.bmi || 25,                         // BMI
        input.heartRate || 70,                   // heartRate
        input.glucose || 85                      // glucose
      ]
    };

    try {
      const response = await fetch(`${this.apiBaseUrl}/predict/hypertension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        disease: 'hypertension',
        riskPercentage: Math.round(result.probability * 100),
        riskLevel: this.getRiskLevel(result.probability * 100),
        confidence: result.confidence || 0.82,
        features: {
          age: input.age,
          sex: input.sex || 0,
          smoking: input.smoking || 0,
          systolicBP: input.systolicBP || 120,
          diastolicBP: input.diastolicBP || 80,
          bmi: input.bmi || 25,
          heartRate: input.heartRate || 70
        }
      };
    } catch (error) {
      console.error('Hypertension prediction error:', error);
      return this.getFallbackPrediction('hypertension', input);
    }
  }

  /**
   * Get enhanced prediction with LLM-generated suggestions
   */
  async getEnhancedPrediction(
    disease: 'diabetes' | 'heart' | 'hypertension',
    input: MLPredictionInput
  ): Promise<EnhancedPredictionResult> {
    let mlResult: MLPredictionResult;

    // Get ML prediction based on disease type
    switch (disease) {
      case 'diabetes':
        mlResult = await this.predictDiabetes(input);
        break;
      case 'heart':
        mlResult = await this.predictHeartDisease(input);
        break;
      case 'hypertension':
        mlResult = await this.predictHypertension(input);
        break;
      default:
        throw new Error(`Unsupported disease type: ${disease}`);
    }

    // Generate LLM suggestions based on the ML prediction
    const llmSuggestions = await this.generateLLMSuggestions(mlResult, input);
    const riskFactors = this.analyzeRiskFactors(mlResult, input);
    const nextSteps = this.generateNextSteps(mlResult);

    return {
      ...mlResult,
      llmSuggestions,
      riskFactors,
      nextSteps
    };
  }

  /**
   * Generate LLM-powered suggestions based on ML prediction
   */
  private async generateLLMSuggestions(
    mlResult: MLPredictionResult,
    input: MLPredictionInput
  ) {
    const prompt = this.buildLLMPrompt(mlResult, input);
    
    try {
      const response = await this.llmService.generateResponse([
        {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `You are a specialized medical AI assistant with expertise in preventive healthcare and risk assessment. 
                   Your role is to provide evidence-based, personalized health recommendations based on machine learning risk predictions.
                   
                   Guidelines:
                   - Always emphasize the importance of professional medical consultation
                   - Provide specific, actionable recommendations
                   - Use current medical best practices and guidelines
                   - Consider individual risk factors and demographics
                   - Be clear about limitations and when to seek immediate care
                   - Focus on preventive measures and lifestyle modifications`,
          timestamp: new Date()
        },
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: prompt,
          timestamp: new Date()
        }
      ], {
        temperature: 0.1, // Lower temperature for more consistent medical advice
        maxTokens: 2000 // Increased for comprehensive recommendations
      });

      return this.parseLLMResponse(response.content);
    } catch (error) {
      console.error('LLM suggestion error:', error);
      return this.getFallbackSuggestions(mlResult.disease, mlResult.riskLevel);
    }
  }

  /**
   * Build comprehensive prompt for LLM optimized for medical recommendations
   */
  private buildLLMPrompt(mlResult: MLPredictionResult, input: MLPredictionInput): string {
    const { disease, riskPercentage, riskLevel, features } = mlResult;
    
    const featuresText = Object.entries(features)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const riskContext = riskLevel === 'High' ? 'requiring immediate attention and intervention' :
                       riskLevel === 'Medium' ? 'requiring proactive management and monitoring' :
                       'manageable with preventive measures';

    return `
MEDICAL RISK ASSESSMENT ANALYSIS

Patient Profile:
- Age: ${input.age} years
- Disease Risk: ${disease} 
- ML Model Prediction: ${riskPercentage}% risk (${riskLevel} risk level)
- Risk Context: ${riskContext}
- Clinical Parameters: ${featuresText}

Please provide evidence-based, personalized medical recommendations in JSON format with these exact categories:

{
  "immediateActions": [
    "List 3-4 specific immediate steps the patient should take based on their ${riskLevel} risk level",
    "Include urgency indicators and timeframes",
    "Consider the specific risk factors present"
  ],
  "lifestyleRecommendations": [
    "Provide 4-5 evidence-based lifestyle modifications",
    "Focus on diet, exercise, stress management, and sleep",
    "Make recommendations specific to ${disease} prevention",
    "Consider the patient's age and risk factors"
  ],
  "medicalAdvice": [
    "List 3-4 professional medical guidance points",
    "Include recommended screenings and follow-ups",
    "Specify consultation urgency based on ${riskLevel} risk",
    "Mention relevant specialists if needed"
  ],
  "preventiveMeasures": [
    "Provide 4-5 evidence-based prevention strategies",
    "Focus on reducing modifiable risk factors",
    "Include both short-term and long-term measures",
    "Be specific to ${disease} prevention"
  ],
  "monitoringGuidelines": [
    "List 3-4 key health metrics to track regularly",
    "Specify monitoring frequency based on risk level",
    "Include both self-monitoring and clinical assessments",
    "Provide target ranges where appropriate"
  ]
}

Important Guidelines:
- Base recommendations on current medical guidelines and evidence
- Consider the patient's ${riskLevel} risk level in all suggestions
- Be specific and actionable rather than generic
- Always emphasize the importance of healthcare provider consultation
- Include appropriate urgency levels based on risk assessment
- Consider age-appropriate recommendations for a ${input.age}-year-old patient
`;
  }

  /**
   * Parse LLM response into structured format
   */
  private parseLLMResponse(content: string) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          immediateActions: parsed.immediateActions || [],
          lifestyleRecommendations: parsed.lifestyleRecommendations || [],
          medicalAdvice: parsed.medicalAdvice || [],
          preventiveMeasures: parsed.preventiveMeasures || [],
          monitoringGuidelines: parsed.monitoringGuidelines || []
        };
      }
      
      // Fallback: parse structured text
      return this.parseStructuredText(content);
    } catch (error) {
      console.error('LLM response parsing error:', error);
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Parse structured text response
   */
  private parseStructuredText(content: string) {
    const sections = {
      immediateActions: this.extractSection(content, 'Immediate Actions'),
      lifestyleRecommendations: this.extractSection(content, 'Lifestyle Recommendations'),
      medicalAdvice: this.extractSection(content, 'Medical Advice'),
      preventiveMeasures: this.extractSection(content, 'Preventive Measures'),
      monitoringGuidelines: this.extractSection(content, 'Monitoring Guidelines')
    };

    return sections;
  }

  /**
   * Extract section from text
   */
  private extractSection(content: string, sectionName: string): string[] {
    const regex = new RegExp(`\\*\\*${sectionName}\\*\\*[\\s\\S]*?(?=\\*\\*|$)`, 'i');
    const match = content.match(regex);
    
    if (match) {
      return match[0]
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
        .map(line => line.trim().replace(/^[-\d.]\s*/, ''))
        .filter(line => line.length > 0);
    }
    
    return [];
  }

  /**
   * Analyze risk factors based on input data
   */
  private analyzeRiskFactors(mlResult: MLPredictionResult, input: MLPredictionInput) {
    const { disease } = mlResult;
    const riskFactors = { high: [], moderate: [], low: [] };

    switch (disease) {
      case 'diabetes':
        if (input.glucose && input.glucose > 140) riskFactors.high.push('Elevated glucose levels');
        if (input.bmi && input.bmi > 30) riskFactors.high.push('Obesity (BMI > 30)');
        if (input.age > 45) riskFactors.moderate.push('Age over 45');
        if (input.bloodPressure && input.bloodPressure > 130) riskFactors.moderate.push('High blood pressure');
        break;
        
      case 'heart':
        if (input.cholesterol && input.cholesterol > 240) riskFactors.high.push('High cholesterol');
        if (input.age > 55) riskFactors.high.push('Advanced age');
        if (input.bloodPressure && input.bloodPressure > 140) riskFactors.moderate.push('Hypertension');
        break;
        
      case 'hypertension':
        if (input.systolicBP && input.systolicBP > 140) riskFactors.high.push('High systolic blood pressure');
        if (input.smoking) riskFactors.high.push('Smoking habit');
        if (input.bmi && input.bmi > 25) riskFactors.moderate.push('Overweight');
        break;
    }

    return riskFactors;
  }

  /**
   * Generate next steps based on risk level
   */
  private generateNextSteps(mlResult: MLPredictionResult): string[] {
    const { riskLevel, disease } = mlResult;
    
    const baseSteps = [
      'Schedule a consultation with your healthcare provider',
      'Share this assessment report with your doctor'
    ];

    if (riskLevel === 'High') {
      return [
        'Seek immediate medical attention',
        'Schedule urgent appointment with specialist',
        ...baseSteps,
        'Consider emergency screening if symptoms worsen',
        'Implement immediate lifestyle modifications'
      ];
    } else if (riskLevel === 'Medium') {
      return [
        'Schedule appointment within 2-4 weeks',
        ...baseSteps,
        'Begin preventive lifestyle changes',
        'Monitor symptoms closely'
      ];
    } else {
      return [
        'Schedule routine checkup',
        ...baseSteps,
        'Maintain healthy lifestyle',
        'Continue regular monitoring'
      ];
    }
  }

  /**
   * Determine risk level based on percentage
   */
  private getRiskLevel(percentage: number): 'Low' | 'Medium' | 'High' {
    if (percentage >= 70) return 'High';
    if (percentage >= 40) return 'Medium';
    return 'Low';
  }

  /**
   * Fallback prediction for when API is unavailable
   */
  private getFallbackPrediction(disease: string, input: MLPredictionInput): MLPredictionResult {
    // Simple rule-based fallback
    let riskPercentage = 20; // Base risk
    
    if (input.age > 50) riskPercentage += 20;
    if (input.bmi && input.bmi > 30) riskPercentage += 15;
    if (input.bloodPressure && input.bloodPressure > 140) riskPercentage += 15;
    
    riskPercentage = Math.min(riskPercentage, 85);
    
    return {
      disease: disease as any,
      riskPercentage,
      riskLevel: this.getRiskLevel(riskPercentage),
      confidence: 0.75,
      features: {
        age: input.age,
        bmi: input.bmi || 25,
        bloodPressure: input.bloodPressure || 120
      }
    };
  }

  /**
   * Fallback suggestions when LLM is unavailable
   */
  private getFallbackSuggestions(disease: string, riskLevel: string) {
    return {
      immediateActions: [
        'Consult with your healthcare provider',
        'Monitor your symptoms daily',
        'Keep a health diary',
        'Take prescribed medications as directed'
      ],
      lifestyleRecommendations: [
        'Maintain a balanced, nutritious diet',
        'Exercise regularly (30 minutes daily)',
        'Get adequate sleep (7-9 hours)',
        'Manage stress through relaxation techniques',
        'Avoid smoking and limit alcohol consumption'
      ],
      medicalAdvice: [
        'Schedule regular health checkups',
        'Discuss family history with your doctor',
        'Follow up on recommended screenings',
        'Keep track of vital signs'
      ],
      preventiveMeasures: [
        'Maintain healthy weight',
        'Follow dietary guidelines',
        'Stay physically active',
        'Monitor risk factors regularly',
        'Take preventive medications if prescribed'
      ],
      monitoringGuidelines: [
        'Check blood pressure regularly',
        'Monitor weight weekly',
        'Track symptoms in a journal',
        'Follow up with healthcare provider as scheduled'
      ]
    };
  }

  /**
   * Default suggestions structure
   */
  private getDefaultSuggestions() {
    return {
      immediateActions: [],
      lifestyleRecommendations: [],
      medicalAdvice: [],
      preventiveMeasures: [],
      monitoringGuidelines: []
    };
  }
}

export const mlPredictionService = new MLPredictionService();
