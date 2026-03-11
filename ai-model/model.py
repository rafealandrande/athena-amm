import torch
import torch.nn as nn

class SniperDetector(nn.Module):
    def __init__(self, input_size=12, hidden_size=64):
        super(SniperDetector, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.bn1 = nn.BatchNorm1d(hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.bn2 = nn.BatchNorm1d(hidden_size)
        self.fc3 = nn.Linear(hidden_size, 32)
        self.fc4 = nn.Linear(32, 1)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.relu(self.bn1(self.fc1(x)))
        x = self.dropout(x)
        x = self.relu(self.bn2(self.fc2(x)))
        x = self.dropout(x)
        x = self.relu(self.fc3(x))
        x = self.sigmoid(self.fc4(x))
        return x

def extract_features(transaction):
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
