#!/bin/bash
set -e

echo "Building Athena..."

echo "Building Solana program..."
cd program
anchor build
cd ..

echo "Building agent..."
cd agent
npm install
npm run build
cd ..

echo "Training AI model..."
cd ai-model
pip install -r requirements.txt
python generate_data.py
python train.py
cd ..

echo "Build complete!"
