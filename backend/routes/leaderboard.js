import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// GET /api/leaderboard - Get reviewer leaderboard
router.get('/', async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;
    
    // Calculate date filter
    let dateFilter = {};
    const now = new Date();
    if (timeframe === 'today') {
      dateFilter = { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
    } else if (timeframe === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: weekAgo } };
    }

    // Aggregate reviewer statistics
    const reviewerStats = await Feedback.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$reviewer',
          reviewCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalRating: { $sum: '$rating' }
        }
      },
      { $sort: { reviewCount: -1, avgRating: -1 } }
    ]);

    // Calculate scores and badges
    const topReviewers = reviewerStats.map((reviewer, index) => {
      const score = (reviewer.reviewCount * 10) + (reviewer.avgRating * 5);
      const badges = [];

      // Award badges
      if (reviewer.reviewCount >= 50) badges.push({ type: 'expert', icon: '👑', name: 'Expert' });
      else if (reviewer.reviewCount >= 20) badges.push({ type: 'veteran', icon: '⭐', name: 'Veteran' });
      else if (reviewer.reviewCount >= 10) badges.push({ type: 'active', icon: '🔥', name: 'Active' });

      if (reviewer.avgRating >= 4.5) badges.push({ type: 'quality', icon: '💎', name: 'Quality' });
      if (index < 3) badges.push({ type: 'top', icon: '🏆', name: 'Top 3' });

      return {
        name: reviewer._id,
        reviewCount: reviewer.reviewCount,
        avgRating: reviewer.avgRating.toFixed(1),
        score: Math.round(score),
        badges
      };
    });

    res.json({
      totalReviewers: reviewerStats.length,
      totalReviews: reviewerStats.reduce((sum, r) => sum + r.reviewCount, 0),
      avgReviewsPerReviewer: reviewerStats.length > 0 
        ? Math.round(reviewerStats.reduce((sum, r) => sum + r.reviewCount, 0) / reviewerStats.length)
        : 0,
      topReviewers: topReviewers.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
