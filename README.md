# LLM Evaluation & Feedback Dashboard

A full-stack application for collecting human feedback on AI-generated text responses.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React, Vite

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
copy .env.example .env
```

4. Update `.env` with your MongoDB URI (default: `mongodb://localhost:27017/llm-feedback`)

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Features

### Backend API

- `GET /api/tasks` - Fetch all pending tasks
- `POST /api/tasks/:id/feedback` - Submit feedback for a task
- `POST /api/tasks/:id/regenerate` - Regenerate LLM output (stubbed)
- `GET /api/stats` - Get dashboard statistics (total tasks, avg rating, distribution)
- `GET /api/feedback` - Get all feedback with optional filters (rating range, reviewer)
- `GET /api/feedback/export` - Export all feedback as JSON

### Frontend

✨ **New Features Added:**

1. **Reviewer Login System**
   - Simple authentication with localStorage
   - Persistent login across sessions
   - Reviewer name auto-filled in feedback

2. **Dashboard Statistics**
   - Total tasks overview
   - Pending vs reviewed counts
   - Average rating calculation
   - Visual rating distribution chart

3. **Feedback Management**
   - View all submitted feedback
   - Filter by rating range (min/max)
   - Filter by reviewer name
   - Export feedback as JSON

4. **Enhanced UI**
   - Tab navigation (Dashboard, Review Tasks, All Feedback)
   - Responsive design for mobile/tablet
   - Loading states and error handling
   - Clean, modern interface

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Review" on any pending task
3. Rate the output (1-5), add comments, optionally correct the output
4. Enter your reviewer name
5. Click "Regenerate Output" to get a new response (optional)
6. Submit feedback to mark task as reviewed

## Project Structure

```
backend/
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── seed.js          # Database seeding script
└── server.js        # Express server

frontend/
├── src/
│   ├── components/  # React components
│   ├── App.jsx      # Main app component
│   └── main.jsx     # Entry point
└── index.html
```

## Notes

- LLM regeneration is currently stubbed (appends timestamp to existing output)
- To integrate real LLM API, update the regenerate endpoint in `backend/routes/tasks.js`
- Add your OpenAI API key to `.env` and implement the API call
