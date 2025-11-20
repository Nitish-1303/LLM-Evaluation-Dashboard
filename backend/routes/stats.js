import express from 'express';
import Task from '../models/Task.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// GET /api/stats - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const reviewedTasks = await Task.countDocuments({ status: 'reviewed' });
    
    const feedbacks = await Feedback.find();
    const totalFeedback = feedbacks.length;
    const avgRating = totalFeedback > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(2)
      : 0;

    const ratingDistribution = {
      1: feedbacks.filter(f => f.rating === 1).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      5: feedbacks.filter(f => f.rating === 5).length,
    };

    res.json({
      totalTasks,
      pendingTasks,
      reviewedTasks,
      totalFeedback,
      avgRating: parseFloat(avgRating),
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
