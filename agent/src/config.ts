export interface Config {
  network: string;
  rpcUrl: string;
  programId: string;
  aiModel: {
    threshold: number;
    updateInterval: number;
  };
}

export function loadConfig(env: string): Config {
  const fs = require('fs');
  const path = `./config/${env}.json`;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}
