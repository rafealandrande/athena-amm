import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import json
from pathlib import Path

class TransactionDataset(Dataset):
    def __init__(self, data_path):
        self.data = self.load_data(data_path)
    
    def load_data(self, path):
        with open(path, 'r') as f:
            return json.load(f)
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        features = torch.tensor([
            item['amount'],
            item['timing_score'],
            item['wallet_age'],
            item['previous_txs'],
            item['mev_score'],
            item['slippage'],
            item['gas_price'],
            item['block_position'],
            item['wallet_reputation'],
            item['token_holdings'],
            item['dex_interaction_count'],
            item['suspicious_pattern_score']
        ], dtype=torch.float32)
        label = torch.tensor(item['is_sniper'], dtype=torch.float32)
        return features, label

def train_model(model, train_loader, val_loader, epochs=50):
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    best_val_loss = float('inf')
    
    for epoch in range(epochs):
        model.train()
        train_loss = 0
        for features, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(features).squeeze()
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
        
        model.eval()
        val_loss = 0
        correct = 0
        total = 0
        with torch.no_grad():
            for features, labels in val_loader:
                outputs = model(features).squeeze()
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                predicted = (outputs > 0.7).float()
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        accuracy = 100 * correct / total
        print(f'Epoch {epoch+1}/{epochs} - Train Loss: {train_loss/len(train_loader):.4f} - Val Loss: {val_loss/len(val_loader):.4f} - Accuracy: {accuracy:.2f}%')
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pth')

if __name__ == '__main__':
    from model import SniperDetector
    
    model = SniperDetector()
    train_dataset = TransactionDataset('data/train.json')
    val_dataset = TransactionDataset('data/val.json')
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32)
    
    train_model(model, train_loader, val_loader)
