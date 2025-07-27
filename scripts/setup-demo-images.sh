#!/bin/bash

# BloomBuddy Demo Image Setup Script
# Creates placeholder images for README demo section

echo "🖼️  Setting up BloomBuddy demo images..."

# Create docs/images directory if it doesn't exist
mkdir -p docs/images

# Image dimensions
WIDTH=1200
HEIGHT=800

# Function to create placeholder image URLs
create_placeholder() {
    local filename=$1
    local title=$2
    local bg_color=$3
    
    echo "📸 Creating placeholder for: $filename"
    
    # Using placeholder.com service
    local url="https://via.placeholder.com/${WIDTH}x${HEIGHT}/${bg_color}/ffffff?text=${title}"
    
    # Download placeholder image (requires curl)
    if command -v curl &> /dev/null; then
        curl -o "docs/images/$filename" "$url"
        echo "✅ Created: docs/images/$filename"
    else
        echo "⚠️  curl not found. Please manually add: $filename"
        echo "   URL: $url"
    fi
}

# Create placeholder images
create_placeholder "dashboard-demo.png" "BloomBuddy+Dashboard" "2563eb"
create_placeholder "chat-interface-demo.png" "AI+Chat+Interface" "059669"
create_placeholder "risk-assessment-form-demo.png" "Health+Assessment+Form" "dc2626"
create_placeholder "risk-assessment-results-demo.png" "Assessment+Results" "7c3aed"
create_placeholder "assessment-results-demo.png" "Detailed+Results+Page" "ea580c"
create_placeholder "pdf-analysis-demo.png" "PDF+Analysis" "0891b2"
create_placeholder "chat-results-demo.png" "Chat+About+Results" "059669"

echo ""
echo "🎉 Demo image setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Replace placeholder images with actual screenshots"
echo "2. Ensure images are optimized for web (compress if needed)"
echo "3. Test README rendering locally or on GitHub"
echo ""
echo "💡 Tips:"
echo "- Take screenshots at 1200x800 resolution for consistency"
echo "- Use sample data only (no real medical information)"
echo "- Maintain consistent UI theme across screenshots"
echo "- Consider using tools like CleanShot X or Skitch for annotations"
