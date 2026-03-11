import torch
import torch.nn as nn

class SniperDetector(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(12, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.network(x)

def extract_features(transaction):
    """Extract features from Solana transaction"""
    return torch.tensor([
        transaction['amount'],
        transaction['timing_score'],
        transaction['wallet_age'],
        transaction['previous_txs'],
        transaction['mev_score'],
        transaction['slippage'],
        transaction['gas_price'],
        transaction['block_position'],
        transaction['wallet_reputation'],
        transaction['token_holdings'],
        transaction['dex_interaction_count'],
        transaction['suspicious_pattern_score']
    ], dtype=torch.float32)
