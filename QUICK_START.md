# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Seed the Database
```bash
npm run seed
```
This creates 5 sample tasks in the in-memory MongoDB.

### Step 3: Start Backend Server
```bash
npm start
```
Server runs on `http://localhost:5000`

### Step 4: Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

### Step 6: Open Browser
Navigate to `http://localhost:3000`

## ✅ You're Ready!

1. Login with your name
2. Explore the dashboard
3. Review tasks
4. Submit feedback

## 🔧 Troubleshooting

**Port already in use?**
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

**MongoDB connection error?**
- The app uses in-memory MongoDB (no installation needed)
- If issues persist, check `backend/server.js` logs

**Frontend not loading?**
- Clear browser cache
- Check console for errors
- Ensure backend is running first
