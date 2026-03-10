import { Connection, PublicKey } from '@solana/web3.js';

export class PerformanceMonitor {
  private metrics: Map<string, number[]>;
  private startTime: number;

  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  recordLatency(operation: string, latency: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(latency);
  }

  getAverageLatency(operation: string): number {
    const latencies = this.metrics.get(operation);
    if (!latencies || latencies.length === 0) return 0;
    return latencies.reduce((a, b) => a + b, 0) / latencies.length;
  }

  getP99Latency(operation: string): number {
    const latencies = this.metrics.get(operation);
    if (!latencies || latencies.length === 0) return 0;
    const sorted = [...latencies].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.99);
    return sorted[index];
  }

  printStats() {
    console.log('\n=== Performance Stats ===');
    for (const [operation, latencies] of this.metrics) {
      console.log(`${operation}:`);
      console.log(`  Avg: ${this.getAverageLatency(operation).toFixed(2)}ms`);
      console.log(`  P99: ${this.getP99Latency(operation).toFixed(2)}ms`);
      console.log(`  Count: ${latencies.length}`);
    }
    console.log('========================\n');
  }
}
