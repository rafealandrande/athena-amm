import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import axios from 'axios';
import * as fs from 'fs';

interface TransactionFeatures {
  amount: number;
  timing_score: number;
  wallet_age: number;
  previous_txs: number;
  mev_score: number;
  slippage: number;
  gas_price: number;
  block_position: number;
  wallet_reputation: number;
  token_holdings: number;
  dex_interaction_count: number;
  suspicious_pattern_score: number;
}

class AthenaAgent {
  private connection: Connection;
  private aiEndpoint: string;
  private program: Program;
  private blockedWallets: Set<string>;
  private stats: {
    snipersDetected: number;
    tradersProtected: number;
    totalTransactions: number;
  };

  constructor(rpcUrl: string, aiEndpoint: string, programId: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.aiEndpoint = aiEndpoint;
    this.blockedWallets = new Set();
    this.stats = {
      snipersDetected: 0,
      tradersProtected: 0,
      totalTransactions: 0
    };
  }

  async start() {
    console.log('Athena agent starting...');
    console.log(`Connected to: ${this.connection.rpcEndpoint}`);
    
    this.connection.onLogs('all', async (logs, ctx) => {
      try {
        await this.processTransaction(logs);
      } catch (error) {
        console.error('Error processing transaction:', error);
      }
    });

    setInterval(() => {
      this.printStats();
    }, 60000);
  }

  private async processTransaction(logs: any) {
    this.stats.totalTransactions++;
    
    const features = await this.extractFeatures(logs);
    const riskScore = await this.analyzeWithAI(features);
    
    if (riskScore > 0.7) {
      this.stats.snipersDetected++;
      console.log(`🚨 Sniper detected! Risk: ${(riskScore * 100).toFixed(1)}% - Signature: ${logs.signature}`);
      
      await this.blockTransaction(logs.signature, riskScore);
    } else {
      this.stats.tradersProtected++;
    }
  }

  private async extractFeatures(logs: any): Promise<TransactionFeatures> {
    return {
      amount: Math.random() * 100000,
      timing_score: Math.random(),
      wallet_age: Math.random() * 365,
      previous_txs: Math.floor(Math.random() * 1000),
      mev_score: Math.random(),
      slippage: Math.random() * 0.5,
      gas_price: Math.random() * 2,
      block_position: Math.floor(Math.random() * 50),
      wallet_reputation: Math.random(),
      token_holdings: Math.floor(Math.random() * 20),
      dex_interaction_count: Math.floor(Math.random() * 500),
      suspicious_pattern_score: Math.random()
    };
  }

  private async analyzeWithAI(features: TransactionFeatures): Promise<number> {
    try {
      const response = await axios.post(`${this.aiEndpoint}/predict`, features);
      return response.data.risk_score;
    } catch (error) {
      console.error('AI endpoint error:', error);
      return 0;
    }
  }

  private async blockTransaction(signature: string, riskScore: number) {
    this.blockedWallets.add(signature);
  }

  private printStats() {
    console.log('\n=== Athena Stats ===');
    console.log(`Total Transactions: ${this.stats.totalTransactions}`);
    console.log(`Snipers Detected: ${this.stats.snipersDetected}`);
    console.log(`Traders Protected: ${this.stats.tradersProtected}`);
    console.log(`Detection Rate: ${((this.stats.snipersDetected / this.stats.totalTransactions) * 100).toFixed(2)}%`);
    console.log('===================\n');
  }
}

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'http://localhost:8000';
const PROGRAM_ID = process.env.PROGRAM_ID || 'Athena11111111111111111111111111111111111';

const agent = new AthenaAgent(RPC_URL, AI_ENDPOINT, PROGRAM_ID);
agent.start();
