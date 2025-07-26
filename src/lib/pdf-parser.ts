import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set up the worker for PDF.js
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.js`;

export interface PDFParseResult {
  text: string;
  pages: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export class PDFParserService {
  static async extractText(file: File): Promise<PDFParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const numPages = pdf.numPages;
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      }
      
      const metadata = await pdf.getMetadata();
      const info = metadata.info as any;
      
      return {
        text: fullText.trim(),
        pages: numPages,
        metadata: {
          title: info?.Title || undefined,
          author: info?.Author || undefined,
          subject: info?.Subject || undefined,
          keywords: info?.Keywords || undefined,
          creator: info?.Creator || undefined,
          producer: info?.Producer || undefined,
          creationDate: info?.CreationDate || undefined,
          modificationDate: info?.ModDate || undefined,
        }
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static isValidPDF(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  static validatePDF(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    if (!this.isValidPDF(file)) {
      return { valid: false, error: 'File is not a valid PDF' };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    return { valid: true };
  }

  static preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/--- Page \d+ ---/g, '')
      .replace(/\f/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
