#!/bin/bash

echo "🚀 Setting up Resume Builder Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env.local
    echo "✅ Environment file created: .env.local"
    echo "⚠️  Please update .env.local with your MongoDB URI and other settings"
else
    echo "✅ Environment file already exists"
fi

# Check if MongoDB URI is set
if grep -q "MONGODB_URI" .env.local; then
    echo "✅ MongoDB URI found in environment file"
else
    echo "⚠️  MongoDB URI not found in environment file"
fi

# Create server directory structure
echo "📁 Creating server directory structure..."
mkdir -p server/{models,services,routes,middleware,config}

echo "✅ Server directory structure created"

# Make the script executable
chmod +x setup-backend.sh

echo ""
echo "🎉 Backend setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your MongoDB URI and JWT secret"
echo "2. Start the backend server: npm run dev:backend"
echo "3. Test the health endpoint: curl http://localhost:5000/health"
echo ""
echo "📚 For more information, see BACKEND_README.md"
echo ""
