import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';

interface ChatPageState {
  initialAnalysis?: string;
  fromReport?: boolean;
  reportData?: {
    fileName: string;
    analysis: string;
    uploadDate: string;
    fileType: string;
    fileSize: string;
  };
}

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { initialAnalysis, fromReport, reportData } = (location.state as ChatPageState) || {};

  // Create initial report data if we have analysis from a report
  const initialReportData = reportData || (initialAnalysis && fromReport ? {
    fileName: 'Medical Report',
    analysis: initialAnalysis,
    uploadDate: new Date().toLocaleString(),
    fileType: 'Unknown',
    fileSize: 'Unknown'
  } : undefined);

  const handleSymptomFlow = () => {
    // This could navigate to a specialized symptom checker
    console.log('Starting symptom flow');
  };

  const handleReportFlow = () => {
    // Navigate back to file upload
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-main relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-accent/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-secondary/3 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Header />
      
      <main className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground hover:bg-white/10 backdrop-blur-sm transition-all duration-200 border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                AI Health Chat
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a conversation with BloomBuddy AI about your health concerns, symptoms, or medical reports
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <ChatInterface
            onSymptomFlow={handleSymptomFlow}
            onReportFlow={handleReportFlow}
            initialReportData={initialReportData}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
