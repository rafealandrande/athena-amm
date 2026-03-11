export class MEVDetector {
  private recentTransactions: Transaction[];
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 1000) {
    this.recentTransactions = [];
    this.maxHistorySize = maxHistorySize;
  }

  detectMEV(transaction: Transaction): MEVScore {
    this.addTransaction(transaction);

    const frontRunScore = this.detectFrontRunning(transaction);
    const sandwichScore = this.detectSandwichAttack(transaction);
    const timingScore = this.analyzeTimingPattern(transaction);

    const totalScore = (frontRunScore + sandwichScore + timingScore) / 3;

    return {
      score: totalScore,
      frontRunning: frontRunScore > 0.7,
      sandwich: sandwichScore > 0.7,
      suspiciousTiming: timingScore > 0.7
    };
  }

  private addTransaction(tx: Transaction) {
    this.recentTransactions.push(tx);
    if (this.recentTransactions.length > this.maxHistorySize) {
      this.recentTransactions.shift();
    }
  }

  private detectFrontRunning(tx: Transaction): number {
    const similarTxs = this.recentTransactions.filter(
      t => t.tokenPair === tx.tokenPair && 
           Math.abs(t.timestamp - tx.timestamp) < 5
    );

    if (similarTxs.length > 0 && tx.gasPrice > similarTxs[0].gasPrice * 1.5) {
      return 0.9;
    }

    return 0.1;
  }

  private detectSandwichAttack(tx: Transaction): number {
    const before = this.recentTransactions.filter(
      t => t.wallet === tx.wallet && t.timestamp < tx.timestamp
    );

    const after = this.recentTransactions.filter(
      t => t.wallet === tx.wallet && t.timestamp > tx.timestamp
    );

    if (before.length > 0 && after.length > 0) {
      return 0.85;
    }

    return 0.15;
  }

  private analyzeTimingPattern(tx: Transaction): number {
    const blockPosition = tx.blockPosition || 0;
    if (blockPosition < 5) {
      return 0.8;
    }
    return 0.2;
  }
}

interface Transaction {
  signature: string;
  wallet: string;
  tokenPair: string;
  amount: number;
  timestamp: number;
  gasPrice: number;
  blockPosition?: number;
}

interface MEVScore {
  score: number;
  frontRunning: boolean;
  sandwich: boolean;
  suspiciousTiming: boolean;
}
