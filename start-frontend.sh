#!/bin/bash

echo "🌐 Starting ILC Blockchain Resume Builder Frontend..."
echo "📍 Port: 3000"
echo "🔧 Environment: Development"
echo ""

# Change to the project root directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in project root"
    exit 1
fi

# Check if API URL is configured
if grep -q "NEXT_PUBLIC_API_URL" .env; then
    echo "🔗 API URL: $(grep 'NEXT_PUBLIC_API_URL' .env)"
else
    echo "🔗 API URL: http://localhost:5001/api (default)"
fi

echo "📁 Starting frontend from: $(pwd)"
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "📱 Editor will be available at: http://localhost:3000/editor"
echo ""

# Start the frontend development server
npm run dev:frontend
