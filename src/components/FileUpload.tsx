import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileAnalyzed?: (analysis: string) => void; // Made optional for backward compatibility
}

export const FileUpload = ({ onFileAnalyzed }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    analyzeFile(file);
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate file analysis
    setTimeout(() => {
      const analysisResults = [
        "Based on your lab report, I can see the following key findings:\n\n✓ Blood glucose levels are within normal range (95 mg/dL)\n✓ Cholesterol levels appear slightly elevated (220 mg/dL)\n✓ Blood pressure readings are normal\n\nRecommendations:\n• Consider dietary modifications to reduce cholesterol\n• Regular cardiovascular exercise\n• Follow up with your healthcare provider",
        
        "Your medical report shows:\n\n✓ Complete Blood Count (CBC) - Normal ranges\n✓ Liver function tests - All within normal limits\n✓ Kidney function - Excellent\n\nOverall assessment indicates good health status. Continue current lifestyle habits and maintain regular check-ups.",
        
        "Report analysis reveals:\n\n⚠️ Slightly elevated blood pressure (138/88 mmHg)\n✓ Normal heart rate and rhythm\n✓ Good overall cardiovascular markers\n\nSuggestions:\n• Monitor sodium intake\n• Increase physical activity\n• Consider stress management techniques"
      ];
      
      const randomAnalysis = analysisResults[Math.floor(Math.random() * analysisResults.length)];
      
      setIsAnalyzing(false);
      
      // Format file size
      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Prepare report data
      const reportData = {
        fileName: file.name,
        uploadDate: new Date().toLocaleString(),
        analysis: randomAnalysis,
        fileType: file.type,
        fileSize: formatFileSize(file.size)
      };
      
      // Navigate to medical report page with data
      navigate('/medical-report', { state: reportData });
      
      // Keep backward compatibility
      if (onFileAnalyzed) {
        onFileAnalyzed(randomAnalysis);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Your medical report has been analyzed successfully.",
      });
    }, 3000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-gradient-card backdrop-blur-sm border-0 shadow-card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Medical Report</h2>
        <p className="text-muted-foreground">
          Upload your medical reports for AI-powered analysis
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border/50 hover:border-primary/50 bg-white/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isAnalyzing ? (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <FileText className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">Analyzing your report...</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is processing your medical document
                </p>
              </div>
            </>
          ) : uploadedFile ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">File uploaded successfully</p>
                <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  Drop your medical report here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (PDF, JPG, PNG - max 10MB)
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Choose File
              </Button>
            </>
          )}
        </div>
      </div>

      {(uploadedFile || isAnalyzing) && (
        <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-accent/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Important Disclaimer</p>
              <p className="text-muted-foreground">
                This is an automated analysis and should not replace professional medical advice. 
                Always consult with your healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};