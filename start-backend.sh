#!/bin/bash

echo "🚀 Starting ILC Blockchain Resume Builder Backend Server..."
echo "📍 Port: 5001"
echo "🔧 Environment: Development"
echo ""

# Change to the project root directory
cd "$(dirname "$0")"

# Check if server/.env file exists
if [ ! -f server/.env ]; then
    echo "❌ Error: server/.env file not found"
    exit 1
fi

# Check if PORT is set to 5001
if ! grep -q "PORT=5001" server/.env; then
    echo "⚠️  Warning: PORT is not set to 5001 in server/.env file"
    echo "   Current PORT setting: $(grep 'PORT=' server/.env || echo 'PORT not found')"
fi

echo "📁 Starting server from: $(pwd)"
echo "🔌 Server will be available at: http://localhost:5001"
echo "📊 Health check: http://localhost:5001/health"
echo "📝 API Base: http://localhost:5001/api"
echo ""

# Start the backend server
npm run dev:backend
