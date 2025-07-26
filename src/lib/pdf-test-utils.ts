/**
 * Test utility for PDF analysis functionality
 * This file helps test the PDF parsing and analysis features
 */

import { PDFParserService } from './pdf-parser';
import { MedicalDocumentAnalyzer } from './medical-analyzer';

export class PDFAnalysisTest {
  /**
   * Test PDF parsing with a sample file
   */
  static async testPDFParsing(file: File): Promise<any> {
    try {
      console.log('🔍 Testing PDF parsing...');
      console.log(`File: ${file.name} (${file.size} bytes)`);
      
      // Validate PDF
      const validation = PDFParserService.validatePDF(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      console.log('✅ PDF validation passed');
      
      // Extract text
      const result = await PDFParserService.extractText(file);
      console.log(`✅ Text extraction completed`);
      console.log(`Pages: ${result.pages}`);
      console.log(`Text length: ${result.text.length} characters`);
      
      if (result.metadata?.title) {
        console.log(`Title: ${result.metadata.title}`);
      }
      
      // Show first 200 characters of extracted text
      const preview = result.text.substring(0, 200) + (result.text.length > 200 ? '...' : '');
      console.log(`Text preview: ${preview}`);
      
      return result;
    } catch (error) {
      console.error('❌ PDF parsing failed:', error);
      throw error;
    }
  }

  /**
   * Test full medical analysis pipeline
   */
  static async testMedicalAnalysis(file: File): Promise<any> {
    try {
      console.log('🩺 Testing medical analysis...');
      
      const analyzer = new MedicalDocumentAnalyzer();
      const result = await analyzer.analyzeDocument(file);
      
      console.log('✅ Medical analysis completed');
      console.log(`Document type: ${result.documentType}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Analysis length: ${result.analysis.length} characters`);
      
      // Show analysis preview
      const analysisPreview = result.analysis.substring(0, 300) + (result.analysis.length > 300 ? '...' : '');
      console.log(`Analysis preview: ${analysisPreview}`);
      
      return result;
    } catch (error) {
      console.error('❌ Medical analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate test report for debugging
   */
  static generateTestReport(file: File, pdfResult?: any, analysisResult?: any): string {
    const report = `
PDF Analysis Test Report
========================
Generated: ${new Date().toLocaleString()}

File Information:
- Name: ${file.name}
- Type: ${file.type}
- Size: ${(file.size / 1024).toFixed(2)} KB

${pdfResult ? `
PDF Parsing Results:
- Pages: ${pdfResult.pages}
- Text Length: ${pdfResult.text.length}
- Has Metadata: ${pdfResult.metadata ? 'Yes' : 'No'}
${pdfResult.metadata?.title ? `- Title: ${pdfResult.metadata.title}` : ''}
` : ''}

${analysisResult ? `
Medical Analysis Results:
- Document Type: ${analysisResult.documentType}
- Confidence: ${(analysisResult.confidence * 100).toFixed(1)}%
- Analysis Length: ${analysisResult.analysis.length}
- Analysis Preview: ${analysisResult.analysis.substring(0, 200)}...
` : ''}

Status: ${pdfResult && analysisResult ? 'SUCCESS' : 'PARTIAL/FAILED'}
    `.trim();

    return report;
  }
}

// Example usage in browser console:
// const fileInput = document.querySelector('input[type="file"]');
// fileInput.addEventListener('change', async (e) => {
//   const file = e.target.files[0];
//   if (file && file.type === 'application/pdf') {
//     try {
//       await PDFAnalysisTest.testPDFParsing(file);
//       await PDFAnalysisTest.testMedicalAnalysis(file);
//     } catch (error) {
//       console.error('Test failed:', error);
//     }
//   }
// });
