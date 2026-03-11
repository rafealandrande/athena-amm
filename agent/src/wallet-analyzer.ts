import { Connection, PublicKey } from '@solana/web3.js';

export class WalletAnalyzer {
  private connection: Connection;
  private walletCache: Map<string, WalletProfile>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.walletCache = new Map();
  }

  async analyzeWallet(address: string): Promise<WalletProfile> {
    if (this.walletCache.has(address)) {
      return this.walletCache.get(address)!;
    }

    const pubkey = new PublicKey(address);
    const accountInfo = await this.connection.getAccountInfo(pubkey);
    const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit: 100 });

    const profile: WalletProfile = {
      address,
      age: this.calculateWalletAge(signatures),
      transactionCount: signatures.length,
      averageTransactionSize: 0,
      dexInteractions: 0,
      reputation: this.calculateReputation(signatures),
      isKnownSniper: false
    };

    this.walletCache.set(address, profile);
    return profile;
  }

  private calculateWalletAge(signatures: any[]): number {
    if (signatures.length === 0) return 0;
    const oldest = signatures[signatures.length - 1];
    const now = Date.now() / 1000;
    return (now - oldest.blockTime) / 86400;
  }

  private calculateReputation(signatures: any[]): number {
    return Math.min(signatures.length / 1000, 1.0);
  }
}

interface WalletProfile {
  address: string;
  age: number;
  transactionCount: number;
  averageTransactionSize: number;
  dexInteractions: number;
  reputation: number;
  isKnownSniper: boolean;
}
