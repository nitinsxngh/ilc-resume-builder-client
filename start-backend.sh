#!/bin/bash

echo "🚀 Starting ILC Blockchain Resume Builder Backend Server..."
echo "📍 Port: 5001"
echo "🔧 Environment: Development"
echo ""

# Change to the project root directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in project root"
    exit 1
fi

# Check if MONGODB_URI is set
if ! grep -q "MONGODB_URI" .env; then
    echo "⚠️  Warning: MONGODB_URI is not set in .env file"
fi

# Check if PORT is set to 5001
if ! grep -q "PORT=5001" .env && ! grep -q "PORT=5000" .env; then
    echo "ℹ️  Using default PORT: 5001"
fi

echo "📁 Starting server from: $(pwd)"
echo "🔌 Server will be available at: http://localhost:5001"
echo "📊 Health check: http://localhost:5001/health"
echo "📝 API Base: http://localhost:5001/api"
echo ""

# Start the backend server
npm run dev:backend
