import React, { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';

interface Stats {
  snipersBlocked: number;
  tradersProtected: number;
  detectionRate: number;
  totalVolume: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    snipersBlocked: 0,
    tradersProtected: 0,
    detectionRate: 0,
    totalVolume: 0
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Athena Protection Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard 
          title="Snipers Blocked"
          value={stats.snipersBlocked}
          color="#ff4444"
        />
        <StatCard 
          title="Traders Protected"
          value={stats.tradersProtected}
          color="#44ff44"
        />
        <StatCard 
          title="Detection Rate"
          value={`${stats.detectionRate.toFixed(1)}%`}
          color="#4444ff"
        />
        <StatCard 
          title="Total Volume"
          value={`$${(stats.totalVolume / 1000000).toFixed(2)}M`}
          color="#ff44ff"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  return (
    <div className="stat-card" style={{ borderColor: color }}>
      <h3>{title}</h3>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}
