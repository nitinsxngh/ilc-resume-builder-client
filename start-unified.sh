#!/bin/bash

echo "🚀 Starting ILC Resume Builder (Unified Frontend + Backend)..."
echo ""

# Change to the project root directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in project root"
    echo "📝 Please create a .env file with required environment variables"
    exit 1
fi

# Check if MONGODB_URI is set
if ! grep -q "MONGODB_URI" .env; then
    echo "⚠️  Warning: MONGODB_URI is not set in .env file"
fi

# Check if Next.js is built
if [ ! -d ".next" ]; then
    echo "📦 Next.js not built yet. Building..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check the errors above."
        exit 1
    fi
    echo "✅ Build complete!"
fi

# Set environment
export NODE_ENV=${NODE_ENV:-production}

# Get port from .env or use default
PORT=$(grep "^PORT=" .env 2>/dev/null | cut -d '=' -f2 | tr -d '"' || echo "3000")
echo "📍 Port: ${PORT}"
echo "🔧 Environment: ${NODE_ENV}"
echo ""
echo "📁 Starting server from: $(pwd)"
echo "🔌 Server will be available at: http://localhost:${PORT}"
echo "📊 Health check: http://localhost:${PORT}/health"
echo "📝 API Base: http://localhost:${PORT}/api"
echo "🌐 Frontend: http://localhost:${PORT}"
echo ""

# Start the unified server
node server/index.js

