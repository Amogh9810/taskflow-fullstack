#!/bin/bash

# TaskFlow Setup Script
# This script helps you set up TaskFlow locally

set -e

echo "=== TaskFlow Setup ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Check if pnpm is installed, otherwise suggest npm
if ! command -v pnpm &> /dev/null; then
    echo "⚠ pnpm not found. Install it with: npm install -g pnpm"
    echo "Using npm instead..."
    PKG_MANAGER="npm"
else
    echo "✓ pnpm found: $(pnpm --version)"
    PKG_MANAGER="pnpm"
fi

echo ""
echo "Installing dependencies..."

# Install root dependencies
$PKG_MANAGER install

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo ""
echo "1. Set up your PostgreSQL database"
echo "2. Copy .env.example to .env in both taskflow-api and taskflow-ui"
echo "3. Update taskflow-api/.env with your DATABASE_URL"
echo "4. Run: cd taskflow-api && $PKG_MANAGER exec prisma db push"
echo "5. Start the development servers:"
echo "   - Backend: $PKG_MANAGER api"
echo "   - Frontend: $PKG_MANAGER ui"
echo ""
echo "Or run both together: $PKG_MANAGER dev"
echo ""
echo "Frontend will be available at http://localhost:5173"
echo "Backend API at http://localhost:3000"
echo "Swagger docs at http://localhost:3000/api-docs"
