#!/bin/bash

echo "🚀 Starting ILC Blockchain Resume Builder Development Environment..."
echo ""

# Check if both .env files exist
if [ ! -f .env ]; then
    echo "❌ Error: Frontend .env file not found in project root"
    echo "   Please ensure you have a .env file with frontend configuration"
    exit 1
fi

# Check environment configuration
echo "🔍 Checking environment configuration..."
if grep -q "MONGODB_URI" .env; then
    echo "✅ MongoDB URI configured"
else
    echo "⚠️  MongoDB URI not found in .env file"
fi

if grep -q "PORT=5001" .env || grep -q "PORT=5000" .env; then
    echo "✅ Backend port configured"
else
    echo "ℹ️  Using default backend port: 5001"
fi

if grep -q "NEXT_PUBLIC_API_URL" .env; then
    echo "✅ Frontend API URL configured"
else
    echo "ℹ️  Using default API URL: http://localhost:5001/api"
fi

echo ""

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
echo "🔄 Starting both servers..."
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
echo "💡 Use 'npm run dev:frontend' or 'npm run dev:backend' to start individual servers"
echo "💡 Or use './start-frontend.sh' or './start-backend.sh' for individual scripts"
