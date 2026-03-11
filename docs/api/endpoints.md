# API Documentation

## Endpoints

### POST /api/analyze
Analyze a transaction for sniper behavior.

**Request:**
```json
{
  "signature": "string",
  "wallet": "string",
  "amount": number
}
```

**Response:**
```json
{
  "risk_score": number,
  "is_sniper": boolean
}
```

### GET /api/stats
Get current protection statistics.

**Response:**
```json
{
  "snipers_blocked": number,
  "traders_protected": number,
  "detection_rate": number
}
```
