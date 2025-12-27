#!/bin/bash

echo "🚀 Starting ILC Blockchain Resume Builder Development Environment..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in project root"
    echo "   Please ensure you have a .env file with configuration"
    exit 1
fi

# Check environment configuration
echo "🔍 Checking environment configuration..."
if grep -q "MONGODB_URI" .env; then
    echo "✅ MongoDB URI configured"
else
    echo "⚠️  MongoDB URI not found in .env file"
fi

# Check port configuration
PORT=$(grep "^PORT=" .env 2>/dev/null | cut -d '=' -f2 | tr -d '"' || echo "3000")
echo "✅ Server port: ${PORT}"

if grep -q "NEXT_PUBLIC_API_URL" .env; then
    API_URL=$(grep "^NEXT_PUBLIC_API_URL=" .env | cut -d '=' -f2 | tr -d '"')
    echo "✅ Frontend API URL configured: ${API_URL}"
else
    echo "ℹ️  Using relative API URL: /api (unified server)"
fi

echo ""
echo "📝 Development Options:"
echo "   1. Unified Server (Recommended) - Frontend + Backend on same port"
echo "   2. Separate Servers - Frontend on 3000, Backend on 5001"
echo ""
read -p "Choose option (1 or 2, default: 1): " choice
choice=${choice:-1}

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 Starting Unified Development Server..."
    echo "   This will run both frontend and backend on port ${PORT}"
    echo "   Frontend: http://localhost:${PORT}"
    echo "   API: http://localhost:${PORT}/api"
    echo "   Health: http://localhost:${PORT}/health"
    echo ""
    echo "⚠️  Note: Next.js will be slower in this mode (no Fast Refresh)"
    echo "   For faster frontend development, use option 2"
    echo ""
    
    # Set development mode
    export NODE_ENV=development
    
    # Start unified server
    npm run dev:unified
else
    echo ""
    echo "🔄 Starting Separate Servers..."
    
    # Function to start backend
    start_backend() {
        echo "🚀 Starting Backend Server on port 5001..."
        echo "   Health check: http://localhost:5001/health"
        echo "   API Base: http://localhost:5001/api"
        echo ""
        
        # Start backend in new terminal (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev:backend"'
        else
            # For Linux/Unix, start in background
            npm run dev:backend &
            echo "Backend started in background (PID: $!)"
        fi
    }

    # Function to start frontend
    start_frontend() {
        echo "🌐 Starting Frontend Server on port 3000..."
        echo "   Frontend: http://localhost:3000"
        echo "   Editor: http://localhost:3000/editor"
        echo ""
        
        # Start frontend in new terminal (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev:frontend"'
        else
            # For Linux/Unix, start in background
            npm run dev:frontend &
            echo "Frontend started in background (PID: $!)"
        fi
    }

    # Start both servers
    start_backend
    sleep 2
    start_frontend

    echo ""
    echo "✅ Development environment started!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔌 Backend: http://localhost:5001"
    echo "📊 Health Check: http://localhost:5001/health"
    echo ""
    echo "💡 Make sure NEXT_PUBLIC_API_URL=http://localhost:5001/api in .env for separate servers"
fi
