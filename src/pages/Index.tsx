import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatInterface } from '@/components/ChatInterface';
import { DiseaseSelector } from '@/components/DiseaseSelector';
import { PredictionForm } from '@/components/PredictionForm';
import { FileUpload } from '@/components/FileUpload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Brain, Heart, MessageCircle, FileText, CheckCircle, Sparkles, ArrowRight, Stethoscope } from 'lucide-react';

type AppState = 'home' | 'chat' | 'disease-selection' | 'prediction-form' | 'file-upload';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedDisease, setSelectedDisease] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const handleStartAssessment = () => {
    setCurrentState('chat');
  };

  const handleSymptomFlow = () => {
    // Stay in chat for symptom flow
  };

  const handleReportFlow = () => {
    setCurrentState('disease-selection');
  };

  const handleDiseaseSelect = (disease: string) => {
    setSelectedDisease(disease);
    setCurrentState('prediction-form');
  };

  const handleOtherSelected = () => {
    setCurrentState('file-upload');
  };

  const handleFileAnalyzed = (analysis: string) => {
    setAnalysisResult(analysis);
    setCurrentState('chat');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Symptom Analysis",
      description: "Chat about your symptoms and get instant, personalized guidance from our AI"
    },
    {
      icon: FileText,
      title: "Report Analysis", 
      description: "Upload medical reports for diabetes, heart disease, and more conditions"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced machine learning provides accurate health risk predictions"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and never shared with third parties"
    }
  ];

  const benefits = [
    "Get instant health insights anytime, anywhere",
    "Upload and analyze medical reports with AI precision", 
    "Personalized risk assessments for diabetes and heart disease",
    "Chat-based interface makes health queries simple",
    "Secure, private, and confidential health analysis"
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header onLogoClick={handleBackToHome} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Home Page */}
        {currentState === 'home' && (
          <div className="animate-fade-in">
            {/* Enhanced Hero Section */}
            <section className="text-center mb-24">
              <div className="max-w-6xl mx-auto">
                {/* Main Hero Content with Enhanced Design */}
                <div className="relative mb-20">
                  {/* Enhanced Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl blur-3xl"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                  
                  <div className="relative bg-gradient-to-br from-white via-white/95 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/95 dark:to-indigo-950/30 backdrop-blur-lg rounded-3xl p-16 border border-white/40 dark:border-gray-700/40 shadow-2xl">
                    {/* Enhanced Icon with Medical Theme */}
                    <div className="flex items-center justify-center mb-10">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
                          <Stethoscope className="w-12 h-12 text-white" />
                        </div>
                        {/* Floating Medical Indicators */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-bounce delay-300">
                          <Heart className="w-3 h-3 text-white fill-current" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce delay-700">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                        {/* Enhanced Glow Effect */}
                        <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-400/40 to-purple-400/40 blur-xl scale-125 opacity-60"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Typography */}
                    <h1 className="text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                      Meet BloomBuddy: Your Personal AI Health Companion
                    </h1>
                    
                    <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12 font-medium">
                      Feeling unwell or curious about a recent test report? BloomBuddy is here to help. 
                      Our smart assistant makes understanding your health simple. Chat about your symptoms to get instant guidance, 
                      or upload your medical reports for conditions like diabetes and heart disease to receive a personalized risk prediction. 
                      Take the first step towards a healthier you, today.
                    </p>
                    
                    {/* Enhanced CTA Button */}
                    <Button
                      onClick={handleStartAssessment}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-xl font-semibold px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Secure Your Health Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="mb-24">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    How BloomBuddy Helps You
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Our AI-powered platform provides comprehensive health analysis and personalized insights
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="group hover:scale-[1.02] transition-all duration-300 p-10 animate-slide-up bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl dark:shadow-gray-900/50" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 flex-shrink-0">
                          <feature.icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Enhanced Benefits Section */}
            <section className="mb-24">
              <div className="max-w-5xl mx-auto">
                <div className="relative">
                  {/* Enhanced Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-3xl blur-xl"></div>
                  
                  <Card className="relative p-16 bg-gradient-to-br from-white via-white/95 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800/95 dark:to-indigo-950/30 border border-indigo-100 dark:border-gray-700/50 shadow-2xl dark:shadow-gray-900/50">
                    <div className="text-center mb-16">
                      <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Why Choose BloomBuddy?
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Experience the future of personalized healthcare
                      </p>
                    </div>
                    
                    <div className="space-y-8 mb-16">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-4 animate-slide-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{benefit}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Button
                        onClick={handleStartAssessment}
                        size="lg"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-xl font-semibold px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
                      >
                        <Stethoscope className="w-6 h-6 mr-3" />
                        Get Started Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Back Button for non-home states */}
        {currentState !== 'home' && (
          <div className="mb-8 animate-slide-up">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="flex items-center gap-3 floating-card bg-white/70 hover:bg-white/90 border-primary/30 transition-spring px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        )}

        {/* Content based on current state */}
        {currentState === 'chat' && (
          <div className="flex flex-col items-center space-y-8">
            <ChatInterface 
              onSymptomFlow={handleSymptomFlow}
              onReportFlow={handleReportFlow}
            />
            
            {analysisResult && (
              <Card className="w-full max-w-5xl mx-auto modern-card p-8 animate-scale-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Medical Report Analysis
                    </h3>
                    <p className="text-muted-foreground">AI-generated insights from your medical data</p>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">{analysisResult}</p>
                </div>
                
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium mb-1">
                        <strong>⚠️ Important Disclaimer</strong>
                      </p>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        This is an automated analysis and should not replace professional medical advice. 
                        Always consult with your healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {currentState === 'disease-selection' && (
          <div className="animate-slide-up">
            <DiseaseSelector
              onSelectDisease={handleDiseaseSelect}
              onOtherSelected={handleOtherSelected}
            />
          </div>
        )}

        {currentState === 'prediction-form' && selectedDisease && (
          <div className="animate-slide-up">
            <PredictionForm disease={selectedDisease} />
          </div>
        )}

        {currentState === 'file-upload' && (
          <div className="animate-slide-up">
            <FileUpload />
          </div>
        )}
      </main>
      
      {/* Footer only on home page */}
      {currentState === 'home' && <Footer />}
    </div>
  );
};

export default Index;
