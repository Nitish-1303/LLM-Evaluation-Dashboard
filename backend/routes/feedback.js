import express from 'express';
import Feedback from '../models/Feedback.js';
import Task from '../models/Task.js';

const router = express.Router();

// GET /api/feedback - Get all feedback with optional filters
router.get('/', async (req, res) => {
  try {
    const { minRating, maxRating, reviewer } = req.query;
    
    let query = {};
    
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseInt(minRating);
      if (maxRating) query.rating.$lte = parseInt(maxRating);
    }
    
    if (reviewer) {
      query.reviewer = new RegExp(reviewer, 'i');
    }

    const feedbacks = await Feedback.find(query)
      .populate('taskId', 'prompt output')
      .sort({ createdAt: -1 });
    
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// GET /api/feedback/export - Export all feedback as JSON
router.get('/export', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('taskId', 'prompt output')
      .sort({ createdAt: -1 });
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.json');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export feedback' });
  }
});

export default router;
