#!/bin/bash

echo "Setting up MoE Router Visualizer..."
echo ""

# Check if we're in the right directory
if [ ! -f "IMPLEMENTATION_PLAN.md" ]; then
    echo "Error: Please run this script from the moe-router-visualizer directory"
    exit 1
fi

echo "Step 1: Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "Step 2: Setting up Frontend..."
cd ../frontend

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo ""
echo "Step 3: Installing tailwindcss-animate..."
cd ..
npm install

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Terminal 1 - Start the backend:"
echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "2. Terminal 2 - Start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to http://localhost:5173"
echo ""
