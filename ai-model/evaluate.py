import torch
from model import SniperDetector
from inference import AthenaAI

def evaluate_model(model_path, test_data_path):
    """Evaluate model performance"""
    import json
    
    model = AthenaAI(model_path)
    
    with open(test_data_path, 'r') as f:
        test_data = json.load(f)
    
    correct = 0
    total = len(test_data)
    true_positives = 0
    false_positives = 0
    true_negatives = 0
    false_negatives = 0
    
    for item in test_data:
        prediction = model.is_sniper(item)
        actual = bool(item['is_sniper'])
        
        if prediction == actual:
            correct += 1
        
        if prediction and actual:
            true_positives += 1
        elif prediction and not actual:
            false_positives += 1
        elif not prediction and actual:
            false_negatives += 1
        else:
            true_negatives += 1
    
    accuracy = 100 * correct / total
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    print(f'Accuracy: {accuracy:.2f}%')
    print(f'Precision: {precision:.4f}')
    print(f'Recall: {recall:.4f}')
    print(f'F1 Score: {f1:.4f}')
    print(f'True Positives: {true_positives}')
    print(f'False Positives: {false_positives}')
    print(f'True Negatives: {true_negatives}')
    print(f'False Negatives: {false_negatives}')

if __name__ == '__main__':
    evaluate_model('best_model.pth', 'data/test.json')
