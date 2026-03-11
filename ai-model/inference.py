import torch
from model import SniperDetector, extract_features

class AthenaAI:
    def __init__(self, model_path=None):
        self.model = SniperDetector()
        if model_path:
            self.model.load_state_dict(torch.load(model_path))
        self.model.eval()
    
    def predict(self, transaction):
        """Predict if transaction is from sniper bot"""
        with torch.no_grad():
            features = extract_features(transaction)
            risk_score = self.model(features).item()
        return risk_score
    
    def is_sniper(self, transaction, threshold=0.7):
        """Binary classification"""
        return self.predict(transaction) > threshold
