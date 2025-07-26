import PDFParserService, { PDFParseResult } from './pdf-processor';
import LLMService from './llm-service';
import type { ConversationMessage } from './conversation-memory';

export interface MedicalAnalysisResult {
  analysis: string;
  extractedText?: string;
  confidence: number;
  documentType: 'pdf' | 'image' | 'unknown';
  metadata?: {
    pages?: number;
    fileSize: string;
    fileName: string;
    extractionMethod: string;
  };
}

export interface AnalysisError {
  message: string;
  code: string;
  details?: any;
}

export class MedicalDocumentAnalyzer {
  private llmService: LLMService;

  constructor() {
    this.llmService = new LLMService();
  }

  /**
   * Analyze a medical document (PDF or image)
   */
  async analyzeDocument(file: File): Promise<MedicalAnalysisResult> {
    try {
      let extractedText = '';
      let documentType: 'pdf' | 'image' | 'unknown' = 'unknown';
      let metadata: any = {};

      // Handle PDF files
      if (PDFParserService.isValidPDF(file)) {
        documentType = 'pdf';
        const pdfResult = await this.extractTextFromPDF(file);
        extractedText = pdfResult.text;
        metadata = {
          pages: pdfResult.pages,
          extractionMethod: 'PDF text extraction',
          ...pdfResult.metadata
        };
      }
      // Handle image files (placeholder for future OCR implementation)
      else if (this.isImageFile(file)) {
        documentType = 'image';
        // For now, we'll return a message about image analysis
        extractedText = `[Image file: ${file.name}] - OCR analysis not yet implemented. Please upload a PDF version of your medical report for text analysis.`;
        metadata = {
          extractionMethod: 'Image file detected',
        };
      }
      else {
        throw new Error('Unsupported file type. Please upload a PDF or image file.');
      }

      // If we have extracted text, send it to LLM for analysis
      let analysis = '';
      let confidence = 0;

      if (extractedText && extractedText.length > 50 && !extractedText.includes('OCR analysis not yet implemented')) {
        const llmAnalysis = await this.getLLMAnalysis(extractedText, file.name);
        analysis = llmAnalysis.analysis;
        confidence = llmAnalysis.confidence;
      } else if (documentType === 'image') {
        analysis = "This appears to be an image file. For the most accurate analysis, please upload a PDF version of your medical report. If you only have an image, please ensure it's clear and readable.";
        confidence = 0.3;
      } else {
        analysis = "Unable to extract meaningful text from this document. Please ensure the file is not corrupted and contains readable text.";
        confidence = 0.1;
      }

      return {
        analysis,
        extractedText: extractedText.length > 1000 ? extractedText.substring(0, 1000) + '...' : extractedText,
        confidence,
        documentType,
        metadata: {
          ...metadata,
          fileSize: this.formatFileSize(file.size),
          fileName: file.name,
        }
      };

    } catch (error) {
      console.error('Error analyzing document:', error);
      throw {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'ANALYSIS_ERROR',
        details: error
      } as AnalysisError;
    }
  }

  /**
   * Extract text from PDF using the PDF parser
   */
  private async extractTextFromPDF(file: File): Promise<PDFParseResult> {
    const validation = PDFParserService.validatePDF(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const result = await PDFParserService.extractText(file);
    result.text = PDFParserService.preprocessText(result.text);
    
    return result;
  }

  /**
   * Check if file is an image
   */
  private isImageFile(file: File): boolean {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.type);
  }

  /**
   * Get LLM analysis of extracted text
   */
  private async getLLMAnalysis(text: string, fileName: string): Promise<{ analysis: string; confidence: number }> {
    try {
      const currentTime = new Date();
      const messages: ConversationMessage[] = [
        {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `You are a medical AI assistant specializing in analyzing medical reports and documents. 
          
          Your task is to:
          1. Analyze the provided medical document text
          2. Identify key medical findings, test results, and health indicators
          3. Provide clear, easy-to-understand explanations
          4. Highlight any concerning findings that may need attention
          5. Suggest follow-up actions or lifestyle recommendations where appropriate
          6. Use medical terminology appropriately but explain complex terms
          
          Format your response with:
          ✓ for normal/good findings
          ⚠️ for concerning findings that need attention
          • for recommendations and suggestions
          
          Always remind users that this is an AI analysis and they should consult healthcare professionals for medical advice.
          
          Keep your analysis focused, clear, and actionable.`,
          timestamp: currentTime
        },
        {
          id: `user-${Date.now() + 1}`,
          role: 'user',
          content: `Please analyze this medical document: "${fileName}"

${text}

Provide a comprehensive analysis of the findings, highlighting key health indicators, any areas of concern, and recommendations.`,
          timestamp: currentTime
        }
      ];

      const response = await this.llmService.generateResponse(messages, {
        temperature: 0.3, // Lower temperature for more consistent medical analysis
        maxTokens: 1000
      });

      // Calculate confidence based on response quality and content
      const confidence = this.calculateConfidence(text, response.content);

      return {
        analysis: response.content,
        confidence
      };

    } catch (error) {
      console.error('Error getting LLM analysis:', error);
      
      // Fallback analysis if LLM fails
      return {
        analysis: this.generateFallbackAnalysis(text),
        confidence: 0.4
      };
    }
  }

  /**
   * Calculate confidence score based on extracted text and analysis quality
   */
  private calculateConfidence(extractedText: string, analysis: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on text quality
    if (extractedText.length > 500) confidence += 0.2;
    if (extractedText.includes('lab') || extractedText.includes('test') || extractedText.includes('result')) confidence += 0.1;
    if (extractedText.includes('blood') || extractedText.includes('pressure') || extractedText.includes('glucose')) confidence += 0.1;

    // Increase confidence based on analysis quality
    if (analysis.includes('✓') || analysis.includes('⚠️')) confidence += 0.1;
    if (analysis.length > 200) confidence += 0.1;

    return Math.min(confidence, 0.9); // Cap at 90%
  }

  /**
   * Generate fallback analysis when LLM is unavailable
   */
  private generateFallbackAnalysis(text: string): string {
    const keywords = {
      positive: ['normal', 'healthy', 'good', 'excellent', 'within range'],
      concerning: ['elevated', 'high', 'low', 'abnormal', 'outside range', 'concerning'],
      tests: ['blood', 'glucose', 'pressure', 'cholesterol', 'hemoglobin', 'white blood cell']
    };

    let analysis = "Document Analysis Summary:\n\n";

    // Look for test results
    const foundTests = keywords.tests.filter(test => 
      text.toLowerCase().includes(test)
    );

    if (foundTests.length > 0) {
      analysis += `Detected test types: ${foundTests.join(', ')}\n\n`;
    }

    // Check for positive indicators
    const positiveFindings = keywords.positive.filter(term => 
      text.toLowerCase().includes(term)
    );

    if (positiveFindings.length > 0) {
      analysis += `✓ Positive findings detected: ${positiveFindings.join(', ')}\n`;
    }

    // Check for concerning indicators
    const concerningFindings = keywords.concerning.filter(term => 
      text.toLowerCase().includes(term)
    );

    if (concerningFindings.length > 0) {
      analysis += `⚠️ Areas that may need attention: ${concerningFindings.join(', ')}\n`;
    }

    analysis += "\n• Please consult with your healthcare provider for detailed interpretation\n";
    analysis += "• This is a basic automated analysis - professional review is recommended\n";
    analysis += "\nNote: This analysis was generated using fallback methods. For more detailed insights, please ensure your LLM service is properly configured.";

    return analysis;
  }

  /**
   * Format file size in human readable format
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
