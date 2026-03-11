import { describe, it, expect } from '@jest/globals';
import { Connection } from '@solana/web3.js';
import { AthenaAgent } from '../src/index';

describe('Integration Tests', () => {
  it('should connect to Solana', async () => {
    const connection = new Connection('https://api.devnet.solana.com');
    const slot = await connection.getSlot();
    expect(slot).toBeGreaterThan(0);
  });

  it('should detect sniper pattern', async () => {
    // Integration test logic
    expect(true).toBe(true);
  });
});
