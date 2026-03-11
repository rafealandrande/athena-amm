import pytest
from model import SniperDetector, extract_features

def test_model_initialization():
    model = SniperDetector()
    assert model is not None

def test_feature_extraction():
    transaction = {
        'amount': 1000,
        'timing_score': 0.5,
        'wallet_age': 30,
        'previous_txs': 100,
        'mev_score': 0.3,
        'slippage': 0.05,
        'gas_price': 1.0,
        'block_position': 10,
        'wallet_reputation': 0.7,
        'token_holdings': 5,
        'dex_interaction_count': 50,
        'suspicious_pattern_score': 0.2
    }
    
    features = extract_features(transaction)
    assert features.shape[0] == 12

def test_model_prediction():
    from inference import AthenaAI
    
    model = AthenaAI()
    
    sniper_tx = {
        'amount': 100000,
        'timing_score': 0.9,
        'wallet_age': 1,
        'previous_txs': 5,
        'mev_score': 0.8,
        'slippage': 0.3,
        'gas_price': 2.5,
        'block_position': 1,
        'wallet_reputation': 0.1,
        'token_holdings': 1,
        'dex_interaction_count': 3,
        'suspicious_pattern_score': 0.9
    }
    
    score = model.predict(sniper_tx)
    assert score > 0.5
