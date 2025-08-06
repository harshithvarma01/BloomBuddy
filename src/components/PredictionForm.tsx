import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, AlertCircle, CheckCircle, Heart, Shield, TrendingUp, Activity, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mlPredictionService, type MLPredictionInput, type EnhancedPredictionResult } from '@/lib/ml-prediction-service';

interface PredictionFormProps {
  disease: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'number' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  unit?: string;
}

const diseaseFields: Record<string, FormField[]> = {
  diabetes: [
    { id: 'pregnancies', label: 'Pregnancies', type: 'number', placeholder: '0', unit: 'times' },
    { id: 'glucose', label: 'Glucose Level', type: 'number', placeholder: '120', unit: 'mg/dL' },
    { id: 'bloodPressure', label: 'Blood Pressure (Diastolic)', type: 'number', placeholder: '70', unit: 'mmHg' },
    { id: 'skinThickness', label: 'Skin Thickness', type: 'number', placeholder: '20', unit: 'mm' },
    { id: 'insulin', label: 'Insulin Level', type: 'number', placeholder: '80', unit: 'mu U/ml' },
    { id: 'bmi', label: 'BMI', type: 'number', placeholder: '25.0', unit: 'kg/m²' },
    { id: 'diabetesPedigreeFunction', label: 'Diabetes Pedigree Function', type: 'number', placeholder: '0.5', unit: 'score' },
    { id: 'age', label: 'Age', type: 'number', placeholder: '35', unit: 'years' }
  ],
  heart: [
    { id: 'age', label: 'Age', type: 'number', placeholder: '45', unit: 'years' },
    { id: 'sex', label: 'Sex', type: 'select', options: [
      { value: '0', label: 'Female' },
      { value: '1', label: 'Male' }
    ]},
    { id: 'chestPain', label: 'Chest Pain Type', type: 'select', options: [
      { value: '0', label: 'Typical Angina' },
      { value: '1', label: 'Atypical Angina' },
      { value: '2', label: 'Non-anginal Pain' },
      { value: '3', label: 'Asymptomatic' }
    ]},
    { id: 'restingBP', label: 'Resting Blood Pressure', type: 'number', placeholder: '120', unit: 'mmHg' },
    { id: 'cholesterol', label: 'Cholesterol', type: 'number', placeholder: '200', unit: 'mg/dL' },
    { id: 'fastingBS', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { id: 'restingECG', label: 'Resting ECG', type: 'select', options: [
      { value: '0', label: 'Normal' },
      { value: '1', label: 'ST-T wave abnormality' },
      { value: '2', label: 'Left ventricular hypertrophy' }
    ]},
    { id: 'maxHeartRate', label: 'Max Heart Rate Achieved', type: 'number', placeholder: '150', unit: 'bpm' },
    { id: 'exerciseAngina', label: 'Exercise Induced Angina', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { id: 'oldpeak', label: 'ST Depression (Oldpeak)', type: 'number', placeholder: '1.0', unit: 'depression' },
    { id: 'slope', label: 'Peak Exercise ST Slope', type: 'select', options: [
      { value: '0', label: 'Upsloping' },
      { value: '1', label: 'Flat' },
      { value: '2', label: 'Downsloping' }
    ]},
    { id: 'ca', label: 'Major Vessels (0-3)', type: 'select', options: [
      { value: '0', label: '0 vessels' },
      { value: '1', label: '1 vessel' },
      { value: '2', label: '2 vessels' },
      { value: '3', label: '3 vessels' }
    ]},
    { id: 'thal', label: 'Thalassemia', type: 'select', options: [
      { value: '1', label: 'Normal' },
      { value: '2', label: 'Fixed Defect' },
      { value: '3', label: 'Reversible Defect' }
    ]}
  ],
  hypertension: [
    { id: 'sex', label: 'Sex', type: 'select', options: [
      { value: '0', label: 'Female' },
      { value: '1', label: 'Male' }
    ]},
    { id: 'age', label: 'Age', type: 'number', placeholder: '40', unit: 'years' },
    { id: 'currentSmoker', label: 'Current Smoker', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { id: 'cigsPerDay', label: 'Cigarettes Per Day', type: 'number', placeholder: '0', unit: 'cigarettes' },
    { id: 'BPMeds', label: 'Blood Pressure Medication', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { id: 'diabetes', label: 'Diabetes', type: 'select', options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Yes' }
    ]},
    { id: 'totChol', label: 'Total Cholesterol', type: 'number', placeholder: '200', unit: 'mg/dL' },
    { id: 'sysBP', label: 'Systolic Blood Pressure', type: 'number', placeholder: '120', unit: 'mmHg' },
    { id: 'diaBP', label: 'Diastolic Blood Pressure', type: 'number', placeholder: '80', unit: 'mmHg' },
    { id: 'bmi', label: 'BMI', type: 'number', placeholder: '25.0', unit: 'kg/m²' },
    { id: 'heartRate', label: 'Heart Rate', type: 'number', placeholder: '70', unit: 'bpm' },
    { id: 'glucose', label: 'Glucose Level', type: 'number', placeholder: '85', unit: 'mg/dL' }
  ]
};

export const PredictionForm = ({ disease }: PredictionFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancedPredictionResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fields = diseaseFields[disease] || [];
  const diseaseNames: Record<string, string> = {
    diabetes: 'Diabetes',
    heart: 'Heart Disease',
    hypertension: 'Hypertension'
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const convertFormDataToMLInput = (): MLPredictionInput => {
    const input: MLPredictionInput = {
      age: parseInt(formData.age) || 35
    };

    // Map form fields to ML input based on disease type
    switch (disease) {
      case 'diabetes':
        // Diabetes model expects: [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]
        input.pregnancies = parseInt(formData.pregnancies) || 0;
        input.glucose = parseInt(formData.glucose) || 0;
        input.bloodPressure = parseInt(formData.bloodPressure) || 0;
        input.skinThickness = parseInt(formData.skinThickness) || 0;
        input.insulin = parseInt(formData.insulin) || 0;
        input.bmi = parseFloat(formData.bmi) || 0;
        input.diabetesPedigreeFunction = parseFloat(formData.diabetesPedigreeFunction) || 0;
        break;
        
      case 'heart':
        // Heart model expects: [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]
        input.sex = parseInt(formData.sex) || 0;
        input.chestPainType = parseInt(formData.chestPain) || 0;
        input.restingBP = parseInt(formData.restingBP) || 0;
        input.cholesterol = parseInt(formData.cholesterol) || 0;
        input.fastingBS = parseInt(formData.fastingBS) || 0;
        input.restingECG = parseInt(formData.restingECG) || 0;
        input.maxHR = parseInt(formData.maxHeartRate) || 0;
        input.exerciseAngina = parseInt(formData.exerciseAngina) || 0;
        input.oldpeak = parseFloat(formData.oldpeak) || 0;
        input.stSlope = parseInt(formData.slope) || 0;
        input.ca = parseInt(formData.ca) || 0;
        input.thal = parseInt(formData.thal) || 1;
        break;
        
      case 'hypertension':
        // Hypertension model expects: [male, age, currentSmoker, cigsPerDay, BPMeds, diabetes, totChol, sysBP, diaBP, BMI, heartRate, glucose]
        input.sex = parseInt(formData.sex) || 0;
        input.smoking = parseInt(formData.currentSmoker) || 0;
        input.cigsPerDay = parseInt(formData.cigsPerDay) || 0;
        input.BPMeds = parseInt(formData.BPMeds) || 0;
        input.diabetes = parseInt(formData.diabetes) || 0;
        input.totChol = parseInt(formData.totChol) || 0;
        input.systolicBP = parseInt(formData.sysBP) || 0;
        input.diastolicBP = parseInt(formData.diaBP) || 0;
        input.bmi = parseFloat(formData.bmi) || 0;
        input.heartRate = parseInt(formData.heartRate) || 0;
        input.glucose = parseInt(formData.glucose) || 0;
        break;
    }

    return input;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mlInput = convertFormDataToMLInput();
      const prediction = await mlPredictionService.getEnhancedPrediction(
        disease as 'diabetes' | 'heart' | 'hypertension',
        mlInput
      );
      
      setResult(prediction);
      
      toast({
        title: "Analysis Complete",
        description: `Your ${diseaseNames[disease]} risk assessment is ready with AI-powered recommendations.`,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error processing your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!result) return;
    
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text('BloomBuddy Health Report', 20, 30);
      
      // Date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Disease type
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${diseaseNames[disease]} Risk Assessment`, 20, 65);
      
      // Risk score
      doc.setFontSize(14);
      const riskColor: [number, number, number] = result.riskLevel === 'Low' ? [34, 139, 34] : 
                       result.riskLevel === 'Medium' ? [255, 165, 0] : [220, 20, 60];
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.text(`Risk Level: ${result.riskLevel} (${result.riskPercentage}%)`, 20, 85);
      
      // Confidence
      doc.setTextColor(0, 0, 0);
      doc.text(`Model Confidence: ${Math.round(result.confidence * 100)}%`, 20, 95);
      
      // Immediate Actions
      doc.setTextColor(0, 0, 0);
      doc.text('Immediate Actions:', 20, 115);
      
      let yPosition = 130;
      result.llmSuggestions.immediateActions.forEach((action, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${action}`, 170);
        lines.forEach((line: string) => {
          doc.text(line, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 2;
      });
      
      // Lifestyle Recommendations
      yPosition += 10;
      doc.text('Lifestyle Recommendations:', 20, yPosition);
      yPosition += 15;
      
      result.llmSuggestions.lifestyleRecommendations.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 7;
      });
      
      // Disclaimer
      yPosition += 15;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      const disclaimer = 'Disclaimer: This report is generated by AI and should not replace professional medical advice. Always consult with your healthcare provider for proper diagnosis and treatment.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
      doc.text(disclaimerLines, 20, yPosition);
      
      // Save the PDF
      doc.save(`BloomBuddy_${diseaseNames[disease]}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your health report has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const navigateToChat = () => {
    // Store the result in sessionStorage for the chat interface to access
    if (result) {
      sessionStorage.setItem('healthAssessmentResult', JSON.stringify({
        disease: diseaseNames[disease],
        result: result,
        timestamp: new Date().toISOString()
      }));
    }
    
    // Navigate to chat page using React Router
    navigate('/chat');
    
    toast({
      title: "Redirecting to Chat",
      description: "You can now discuss your health report with our AI assistant.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-card backdrop-blur-sm border-0 shadow-card">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          {diseaseNames[disease]} Risk Assessment
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Please fill in your health information for analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-xs sm:text-sm font-medium">
                {field.label} {field.unit && <span className="text-muted-foreground">({field.unit})</span>}
              </Label>
              {field.type === 'number' ? (
                <Input
                  id={field.id}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="bg-white/50 border-primary/30 focus:border-primary transition-smooth text-sm sm:text-base"
                  required
                />
              ) : (
                <select
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full p-2 sm:p-2.5 rounded-md border border-primary/30 bg-white/50 focus:border-primary transition-smooth text-sm sm:text-base"
                  required
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {!result && (
          <Button
            type="submit"
            disabled={isLoading || fields.some(field => !formData[field.id])}
            className="w-full bg-primary hover:bg-primary/90 transition-smooth py-2.5 sm:py-3 text-sm sm:text-base"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Risk'}
          </Button>
        )}

        {isLoading && (
          <div className="space-y-2">
            <Progress value={66} className="w-full" />
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Running ML analysis...
            </p>
          </div>
        )}

        {result && (
          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8 animate-slide-up">
            {/* Risk Assessment Header */}
            <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                {result.riskLevel === 'Low' ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                ) : result.riskLevel === 'Medium' ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Risk Assessment Result</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Based on ML Analysis & AI Recommendations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-0">
                  <div className={`text-2xl sm:text-3xl font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskPercentage}%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Risk Level</p>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Confidence</p>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className={`text-xl sm:text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Risk Category</p>
                </div>
              </div>
              
              <Progress value={result.riskPercentage} className="h-2 sm:h-3" />
            </div>

            {/* Risk Factors Analysis */}
            {(result.riskFactors.high.length > 0 || result.riskFactors.moderate.length > 0) && (
              <Card className="p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  Risk Factors Analysis
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {result.riskFactors.high.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-red-600 dark:text-red-400 text-sm sm:text-base">High Risk Factors</h5>
                      <ul className="space-y-1">
                        {result.riskFactors.high.map((factor, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            <span className="break-words">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.riskFactors.moderate.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">Moderate Risk Factors</h5>
                      <ul className="space-y-1">
                        {result.riskFactors.moderate.map((factor, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                            <span className="break-words">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* AI-Powered Recommendations */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Immediate Actions */}
              {result.llmSuggestions.immediateActions.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Immediate Actions
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {result.llmSuggestions.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Lifestyle Recommendations */}
              {result.llmSuggestions.lifestyleRecommendations.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                    Lifestyle Changes
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {result.llmSuggestions.lifestyleRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Medical Advice */}
              {result.llmSuggestions.medicalAdvice.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    Medical Guidance
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {result.llmSuggestions.medicalAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Monitoring Guidelines */}
              {result.llmSuggestions.monitoringGuidelines.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    Monitoring Guidelines
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {result.llmSuggestions.monitoringGuidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Next Steps */}
            {result.nextSteps.length > 0 && (
              <Card className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-indigo-200 dark:border-gray-600">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 dark:text-indigo-300">Recommended Next Steps</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                  {result.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-100 dark:border-gray-600">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <Button
                onClick={generatePDF}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={navigateToChat}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Chat About Report
              </Button>
              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Run New Assessment
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl sm:rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-medium mb-1">
                    <strong>⚠️ Important Medical Disclaimer</strong>
                  </p>
                  <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    This AI-powered risk assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
                    The predictions are based on machine learning models and may not account for all individual health factors. 
                    Always consult with qualified healthcare providers for proper medical evaluation and treatment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};