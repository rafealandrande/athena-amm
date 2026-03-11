#!/bin/bash
set -e

echo "Deploying Athena to devnet..."

solana config set --url devnet

cd program
anchor deploy
PROGRAM_ID=$(solana address -k target/deploy/athena-keypair.json)
echo "Program deployed: $PROGRAM_ID"
cd ..

echo "Starting agent..."
cd agent
PROGRAM_ID=$PROGRAM_ID npm start &
cd ..

echo "Deployment complete!"
