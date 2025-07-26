import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MedicalDocumentAnalyzer } from '@/lib/medical-analyzer';

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
    
    try {
      // Initialize the medical document analyzer
      const analyzer = new MedicalDocumentAnalyzer();
      
      // Analyze the document
      const result = await analyzer.analyzeDocument(file);
      
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
        analysis: result.analysis,
        fileType: file.type,
        fileSize: formatFileSize(file.size),
        documentType: result.documentType,
        confidence: result.confidence,
        extractedText: result.extractedText
      };
      
      // Navigate to medical report page with data
      navigate('/medical-report', { state: reportData });
      
      // Keep backward compatibility
      if (onFileAnalyzed) {
        onFileAnalyzed(result.analysis);
      }
      
      toast({
        title: "Analysis Complete",
        description: `Your ${result.documentType.toUpperCase()} file has been analyzed successfully. Confidence: ${Math.round(result.confidence * 100)}%`,
      });
      
    } catch (error) {
      setIsAnalyzing(false);
      console.error('Analysis error:', error);
      
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as any).message 
        : 'Failed to analyze the document';
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
          aria-label="Upload medical report file"
          title="Upload medical report file"
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