#!/bin/bash

# BloomBuddy Frontend Deployment Preparation Script

echo "🚀 Preparing BloomBuddy Frontend for Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the BloomBuddy root directory?"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please create one with your API keys."
    exit 1
fi

echo "📋 Pre-deployment checklist:"

# Check for required environment variables
echo "🔍 Checking environment variables..."
if grep -q "localhost:5000" .env; then
    echo "⚠️  WARNING: .env still contains localhost URL. Update VITE_ML_API_URL for production!"
    echo "   Current value: $(grep VITE_ML_API_URL .env)"
    echo "   Please update to your deployed backend URL"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies are installed"
fi

# Run type check
echo "🔍 Running TypeScript check..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix TypeScript errors first."
    npm run build
    exit 1
fi

# Test production build
echo "🧪 Testing production build..."
npm run preview &
PREVIEW_PID=$!
sleep 3

# Kill the preview server
kill $PREVIEW_PID 2>/dev/null

echo ""
echo "✅ Frontend is ready for deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Update VITE_ML_API_URL in .env to your deployed backend URL"
echo "2. Choose a deployment method:"
echo "   • Vercel: npm install -g vercel && vercel"
echo "   • Netlify: npm install -g netlify-cli && netlify deploy --prod --dir=dist"
echo "   • Manual: Upload the dist/ folder to your hosting service"
echo ""
echo "📚 See FRONTEND_DEPLOYMENT.md for detailed instructions"
