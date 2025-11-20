# API Documentation

Base URL: `http://localhost:5000/api`

## Tasks Endpoints

### GET /tasks
Get all pending tasks.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "prompt": "Explain quantum computing",
    "output": "Quantum computing uses...",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /tasks/:id/feedback
Submit feedback for a task.

**Request Body:**
```json
{
  "rating": 4,
  "comments": "Good explanation",
  "correctedOutput": "Optional correction",
  "reviewer": "John Doe"
}
```

**Validation:**
- `rating`: Required, 1-5
- `comments`: Required, non-empty string
- `reviewer`: Required, non-empty string
- `correctedOutput`: Optional

**Response:**
```json
{
  "success": true,
  "feedback": {
    "_id": "507f1f77bcf86cd799439012",
    "taskId": "507f1f77bcf86cd799439011",
    "rating": 4,
    "comments": "Good explanation",
    "reviewer": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /tasks/:id/regenerate
Regenerate LLM output for a task.

**Response:**
```json
{
  "success": true,
  "output": "[Regenerated] New output..."
}
```

## Statistics Endpoints

### GET /stats
Get dashboard statistics.

**Response:**
```json
{
  "totalTasks": 5,
  "pendingTasks": 3,
  "reviewedTasks": 2,
  "totalFeedback": 2,
  "avgRating": 4.5,
  "ratingDistribution": {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 1,
    "5": 1
  }
}
```

## Feedback Endpoints

### GET /feedback
Get all feedback with optional filters.

**Query Parameters:**
- `minRating`: Minimum rating (1-5)
- `maxRating`: Maximum rating (1-5)
- `reviewer`: Reviewer name (partial match)

**Example:**
```
GET /feedback?minRating=4&maxRating=5&reviewer=John
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "taskId": {
      "_id": "507f1f77bcf86cd799439011",
      "prompt": "Explain quantum computing",
      "output": "Quantum computing uses..."
    },
    "rating": 5,
    "comments": "Excellent explanation",
    "reviewer": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /feedback/export
Export all feedback as JSON file.

**Response:**
Downloads `feedback-export.json` with all feedback data.

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Rating must be between 1 and 5"
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to fetch tasks"
}
```
