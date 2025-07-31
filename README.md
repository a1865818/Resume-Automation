# Resume Automation Frontend

This is a Next.js application for automated resume processing and optimization.

## Features

### Enhanced OCR with Gemini Vision API

The application now includes advanced OCR capabilities using Google's Gemini Vision API, which provides superior text extraction compared to traditional OCR methods, especially for:

- **Styled text on colored backgrounds** (like white text on grey backgrounds)
- **Complex document layouts**
- **Small or stylized text**
- **Text in different colors or fonts**
- **Skills sections and technical content**

#### How to Use Gemini Vision OCR

1. **Set up your API key:**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Test the functionality:**
   - Navigate to `/ocr-test` to access the OCR testing interface
   - Use the "Gemini Vision OCR Test" section to compare performance
   - Use the "Skills Extraction Test" for specialized skills extraction

3. **Programmatic usage:**
   ```javascript
   import { extractTextFromPDF, extractSkillsSection } from './utils/pdfUtils';

   // Enhanced OCR with Gemini Vision (default)
   const text = await extractTextFromPDF(file, {
     preferGemini: true,        // Use Gemini Vision OCR
     fallbackToTesseract: true, // Fallback to Tesseract if needed
     verbose: true
   });

   // Skills-specific extraction
   const skills = await extractSkillsSection(file, 1);
   ```

#### OCR Methods Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Gemini Vision OCR** | Superior text extraction, handles styled text, better accuracy | Requires API key, slower, costs money | Complex documents, styled text, skills sections |
| **Tesseract OCR** | Free, fast, works offline | Limited with styled text, lower accuracy | Simple documents, fallback option |

#### Testing and Validation

The application includes comprehensive testing tools:

- **Basic OCR Test**: Tests Tesseract.js functionality
- **Gemini Vision OCR Test**: Compares Gemini vs Tesseract performance
- **Skills Extraction Test**: Specialized skills extraction testing
- **Enhanced PDF Test**: Full document processing with fallback

#### Configuration Options

```javascript
const options = {
  preferGemini: true,           // Use Gemini Vision OCR as primary
  fallbackToTesseract: true,    // Fallback to Tesseract if Gemini fails
  verbose: false,               // Enable detailed logging
  ocrScale: 2.0,               // Image rendering scale
  apiKey: null                  // Override API key
};
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. Run the development server:
```bash
npm run dev
   ```

4. Navigate to `/ocr-test` to test OCR functionality

## API Keys Required

- **Gemini API Key**: For enhanced OCR functionality
  - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Set as: `NEXT_PUBLIC_GEMINI_API_KEY`

## Troubleshooting

### OCR Issues

1. **Gemini Vision OCR not working:**
   - Check your API key is set correctly
   - Verify the API key has vision capabilities enabled
   - Check browser console for error messages

2. **Poor text extraction:**
   - Try increasing the `ocrScale` option
   - Use the skills extraction function for specific sections
   - Check if the document has very low resolution

3. **API rate limits:**
   - Gemini Vision API has usage limits
   - Consider implementing caching for repeated documents
   - Use Tesseract fallback for high-volume processing

### Performance Optimization

- **For large documents**: Process pages individually
- **For batch processing**: Implement request queuing
- **For production**: Consider server-side OCR processing

## License

This project is licensed under the MIT License.
