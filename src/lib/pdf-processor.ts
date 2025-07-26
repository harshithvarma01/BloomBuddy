import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PDFParseResult {
  text: string;
  pages: number;
  metadata: {
    fileSize: string;
    fileName: string;
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
}

export interface PDFValidationResult {
  isValid: boolean;
  errors: string[];
  fileSize: number;
}

class PDFParserService {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly SUPPORTED_MIME_TYPES = ['application/pdf'];

  /**
   * Check if a file is a valid PDF
   */
  static isValidPDF(file: File): boolean {
    return this.SUPPORTED_MIME_TYPES.includes(file.type) && 
           file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Validate PDF file with detailed error reporting
   */
  static validatePDF(file: File): PDFValidationResult {
    const result: PDFValidationResult = {
      isValid: true,
      errors: [],
      fileSize: file.size
    };

    if (!file) {
      result.isValid = false;
      result.errors.push('No file provided');
      return result;
    }

    if (!this.SUPPORTED_MIME_TYPES.includes(file.type)) {
      result.isValid = false;
      result.errors.push(`Unsupported file type: ${file.type}. Only PDF files are supported.`);
    }

    if (file.size === 0) {
      result.isValid = false;
      result.errors.push('File is empty');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      result.isValid = false;
      result.errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    return result;
  }

  /**
   * Extract text from PDF file
   */
  static async extractText(file: File): Promise<PDFParseResult> {
    try {
      const validation = this.validatePDF(file);
      if (!validation.isValid) {
        throw new Error(`PDF validation failed: ${validation.errors.join(', ')}`);
      }

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/cmaps/',
        cMapPacked: true,
        enableXfa: false, // Disable XFA forms to avoid compatibility issues
      }).promise;

      // Extract metadata
      const metadata = await pdf.getMetadata();
      const info = metadata?.info as any; // Type assertion for PDF metadata
      const pdfMetadata = {
        fileSize: this.formatFileSize(file.size),
        fileName: file.name,
        title: info?.Title || undefined,
        author: info?.Author || undefined,
        creator: info?.Creator || undefined,
        producer: info?.Producer || undefined,
        creationDate: info?.CreationDate || undefined,
        modificationDate: info?.ModDate || undefined,
      };

      // Extract text from all pages
      let fullText = '';
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine text items with proper spacing
          const pageText = textContent.items
            .map((item: any) => {
              if ('str' in item) {
                return item.str;
              }
              return '';
            })
            .join(' ');

          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          fullText += `[Error extracting page ${pageNum}]\n\n`;
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text could be extracted from the PDF. The document may contain only images or be password-protected.');
      }

      return {
        text: fullText.trim(),
        pages: numPages,
        metadata: pdfMetadata
      };

    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Preprocess extracted text for better analysis
   */
  static preprocessText(text: string): string {
    if (!text) return '';
    
    return text
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Clean up common PDF artifacts
      .replace(/\x00/g, '') // Remove null characters
      .replace(/\uFFFD/g, '') // Remove replacement characters
      // Trim and normalize
      .trim();
  }

  /**
   * Format file size for display
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default PDFParserService;
