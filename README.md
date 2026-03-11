# Athena

<div align="center">
  <img src="./assets/athena.png" width="300" alt="Athena"/>
</div>

Athena is the first AI agent market maker built for Solana. She detects and blocks sniper bots in real-time, protecting traders during token launches.

## Overview

Token launches get destroyed by sniper bots. These automated programs buy massive amounts in the first block, front-run legitimate traders, and dump immediately. Athena stops them.

She uses machine learning to analyze every transaction in under 100ms. When she spots a sniper, the on-chain program blocks them automatically. Built on Solana's 400ms blocks, she's faster than any bot.

### The Problem

Token launches on DEXs face a critical issue: sniper bots. These programs exploit new launches by buying massive amounts in the first block, using MEV to front-run traders, and dumping immediately. This destroys price discovery and makes fair launches impossible.

Traditional AMMs treat all transactions equally. They have no defense against bots with superior infrastructure.

### The Solution

Athena combines three technologies to stop snipers:

1. AI Detection Engine: A neural network trained on thousands of sniper transactions that identifies bot behavior in real-time
2. On-Chain Enforcement: A Solana program that blocks high-risk transactions automatically
3. Autonomous Monitoring: An agent that watches DEX activity 24/7 and feeds data to the AI

Result: sniper detection and blocking in under 100 milliseconds.

## Installation

### Prerequisites
- Rust 1.75+
- Solana CLI 1.17+
- Anchor 0.29+
- Node.js 18+
- Python 3.10+

### Build from Source

```bash
git clone https://github.com/rafealandrande/athena-amm.git
cd athena-amm

# Build Solana program
cd program
anchor build
cd ..

# Build monitoring agent
cd agent
npm install
npm run build
cd ..

# Train AI model
cd ai-model
pip install -r requirements.txt
python generate_data.py
python train.py
cd ..
```

### Deploy to Devnet

```bash
solana config set --url devnet
cd program
anchor deploy
```

## Usage

### Start the Monitoring Agent

```bash
cd agent
SOLANA_RPC_URL=https://api.devnet.solana.com \
PROGRAM_ID=<your-program-id> \
npm start
```

### Run the AI Model

```bash
cd ai-model
python inference.py
```

## Architecture

Athena consists of three main components:

**AI Model** (PyTorch)
- Neural network trained on transaction patterns
- Analyzes 12 features per transaction
- 95%+ accuracy on sniper detection

**Solana Program** (Rust/Anchor)
- On-chain AMM with anti-sniper logic
- Enforces risk score thresholds
- Constant product market maker

**Monitoring Agent** (TypeScript)
- Watches all DEX transactions
- Feeds data to AI model
- Blocks high-risk swaps

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
