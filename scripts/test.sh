#!/bin/bash
set -e

echo "Running tests..."

echo "Testing AI model..."
cd ai-model
python -m pytest tests/ -v
cd ..

echo "Testing Solana program..."
cd program
cargo test
cd ..

echo "Testing agent..."
cd agent
npm test
cd ..

echo "All tests passed!"
