#!/bin/bash
# Quick setup script for development

echo "🚀 Starting Image Sharing Platform..."

# Check for required tools
echo "📋 Checking requirements..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. You can still run without Docker."
    echo "   Use manual setup instead."
fi

echo "✅ Requirements check passed"

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "   ✅ Created .env"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "   ✅ Created backend/.env"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "   ✅ Created frontend/.env.local"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  Option 1: docker-compose up --build"
echo "  Option 2: Read GETTING_STARTED.md for manual setup"
echo ""
