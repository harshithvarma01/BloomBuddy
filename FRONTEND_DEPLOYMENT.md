# BloomBuddy Frontend Deployment Guide

## 🚀 Frontend Deployment Options

### Option 1: Vercel (Recommended for React apps)

1. **Prepare for deployment:**
   ```bash
   # Update your .env file with production backend URL
   # Replace 'your-deployed-backend-url.com' with your actual backend URL
   VITE_ML_API_URL=https://your-deployed-backend-url.com/api
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from your project directory
   cd "/path/to/BloomBuddy"
   vercel
   
   # Follow the prompts:
   # - Link to existing project or create new
   # - Set build command: npm run build
   # - Set output directory: dist
   ```

3. **Configure Environment Variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your project → Settings → Environment Variables
   - Add these variables:
     - `VITE_ML_API_URL`: Your backend API URL
     - `VITE_ANTHROPIC_API_KEY`: Your Anthropic API key
     - `VITE_OPENAI_API_KEY`: Your OpenAI API key
     - `VITE_GOOGLE_API_KEY`: Your Google API key
     - `VITE_DEFAULT_LLM_PROVIDER`: anthropic

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via Netlify Dashboard:**
   - Drag and drop the `dist` folder to Netlify
   - Configure environment variables in Site Settings

### Option 3: Static Hosting (GitHub Pages, Firebase, etc.)

1. **Build for production:**
   ```bash
   # Make sure your .env has production values
   npm run build
   ```

2. **Deploy the dist/ folder** to your preferred static hosting service

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Update `VITE_ML_API_URL` to your deployed backend URL
- [ ] Verify all API keys are correct
- [ ] Test that backend is accessible and CORS is configured

### ✅ Build Testing
- [ ] Run `npm run build` locally to test build process
- [ ] Run `npm run preview` to test production build locally
- [ ] Check that all features work with production backend

### ✅ CORS Configuration
Make sure your backend (Flask server) allows requests from your frontend domain:
```python
# In your Flask app
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://your-frontend-domain.com'])
```

## 🔧 Build Commands Reference

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run development server
npm run dev
```

## 🌐 Domain Configuration

Once deployed, you may want to:
1. Configure a custom domain
2. Set up HTTPS (usually automatic with Vercel/Netlify)
3. Configure CDN for better performance

## 🐛 Common Deployment Issues

### API Connection Issues
- Verify backend URL is correct and accessible
- Check CORS configuration on backend
- Ensure environment variables are set correctly

### Build Failures
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check for missing environment variables

### Runtime Errors
- Check browser console for errors
- Verify API endpoints are accessible
- Test with different LLM providers

## 📊 Post-Deployment Testing

Test these key features after deployment:
- [ ] Health assessment forms load and submit
- [ ] Chat interface connects to LLM
- [ ] PDF upload and analysis works
- [ ] Assessment results display correctly
- [ ] "Chat About Report" navigation works

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Monitor API usage and costs
- Consider implementing rate limiting for production use

---

**Need help?** Check the main README.md for troubleshooting tips or create an issue in the repository.
