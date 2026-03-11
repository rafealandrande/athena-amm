import numpy as np
import json
from pathlib import Path

def generate_synthetic_data(num_samples=10000, sniper_ratio=0.15):
    """Generate synthetic training data for sniper detection"""
    data = []
    
    for i in range(num_samples):
        is_sniper = np.random.random() < sniper_ratio
        
        if is_sniper:
            # Sniper characteristics
            amount = np.random.uniform(50000, 500000)
            timing_score = np.random.uniform(0.8, 1.0)
            wallet_age = np.random.uniform(0, 30)
            previous_txs = np.random.randint(0, 50)
            mev_score = np.random.uniform(0.7, 1.0)
            slippage = np.random.uniform(0.05, 0.5)
            gas_price = np.random.uniform(1.5, 3.0)
            block_position = np.random.randint(0, 5)
            wallet_reputation = np.random.uniform(0, 0.3)
            token_holdings = np.random.randint(0, 3)
            dex_interaction_count = np.random.randint(0, 20)
            suspicious_pattern_score = np.random.uniform(0.6, 1.0)
        else:
            # Normal trader characteristics
            amount = np.random.uniform(100, 10000)
            timing_score = np.random.uniform(0, 0.5)
            wallet_age = np.random.uniform(30, 365)
            previous_txs = np.random.randint(50, 1000)
            mev_score = np.random.uniform(0, 0.3)
            slippage = np.random.uniform(0.01, 0.1)
            gas_price = np.random.uniform(0.5, 1.2)
            block_position = np.random.randint(5, 50)
            wallet_reputation = np.random.uniform(0.5, 1.0)
            token_holdings = np.random.randint(3, 20)
            dex_interaction_count = np.random.randint(50, 500)
            suspicious_pattern_score = np.random.uniform(0, 0.4)
        
        data.append({
            'amount': float(amount),
            'timing_score': float(timing_score),
            'wallet_age': float(wallet_age),
            'previous_txs': int(previous_txs),
            'mev_score': float(mev_score),
            'slippage': float(slippage),
            'gas_price': float(gas_price),
            'block_position': int(block_position),
            'wallet_reputation': float(wallet_reputation),
            'token_holdings': int(token_holdings),
            'dex_interaction_count': int(dex_interaction_count),
            'suspicious_pattern_score': float(suspicious_pattern_score),
            'is_sniper': int(is_sniper)
        })
    
    return data

if __name__ == '__main__':
    Path('data').mkdir(exist_ok=True)
    
    train_data = generate_synthetic_data(8000)
    val_data = generate_synthetic_data(1000)
    test_data = generate_synthetic_data(1000)
    
    with open('data/train.json', 'w') as f:
        json.dump(train_data, f)
    
    with open('data/val.json', 'w') as f:
        json.dump(val_data, f)
    
    with open('data/test.json', 'w') as f:
        json.dump(test_data, f)
    
    print(f'Generated {len(train_data)} training samples')
    print(f'Generated {len(val_data)} validation samples')
    print(f'Generated {len(test_data)} test samples')
