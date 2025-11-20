import express from 'express';
import Feedback from '../models/Feedback.js';
import Task from '../models/Task.js';

const router = express.Router();

// GET /api/trends - Get trend analysis
router.get('/', async (req, res) => {
  try {
    // Rating trend over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ratingTrend = await Feedback.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Common issues from comments
    const allFeedback = await Feedback.find({});
    const issueKeywords = {
      'Too Technical': ['technical', 'complex', 'difficult', 'jargon'],
      'Too Vague': ['vague', 'unclear', 'ambiguous', 'confusing'],
      'Inaccurate': ['wrong', 'incorrect', 'inaccurate', 'error'],
      'Too Long': ['long', 'verbose', 'wordy', 'lengthy'],
      'Missing Details': ['missing', 'incomplete', 'lacks', 'needs more']
    };

    const issueCounts = {};
    Object.keys(issueKeywords).forEach(category => {
      issueCounts[category] = 0;
      allFeedback.forEach(feedback => {
        const lowerComments = feedback.comments.toLowerCase();
        if (issueKeywords[category].some(keyword => lowerComments.includes(keyword))) {
          issueCounts[category]++;
        }
      });
    });

    const totalIssues = Object.values(issueCounts).reduce((a, b) => a + b, 0) || 1;
    const commonIssues = Object.entries(issueCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalIssues) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Quality improvement calculation
    const recentFeedback = await Feedback.find({ createdAt: { $gte: sevenDaysAgo } });
    const olderFeedback = await Feedback.find({ 
      createdAt: { 
        $lt: sevenDaysAgo,
        $gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
      } 
    });

    const recentAvg = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, f) => sum + f.rating, 0) / recentFeedback.length
      : 0;
    const olderAvg = olderFeedback.length > 0
      ? olderFeedback.reduce((sum, f) => sum + f.rating, 0) / olderFeedback.length
      : 0;

    const qualityChange = olderAvg > 0 
      ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
      : 0;

    // Top performing prompts
    const taskRatings = await Feedback.aggregate([
      {
        $group: {
          _id: '$taskId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gte: 1 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 }
    ]);

    const topPrompts = await Promise.all(
      taskRatings.map(async (rating) => {
        const task = await Task.findById(rating._id);
        return {
          text: task ? task.prompt.substring(0, 60) + '...' : 'Unknown',
          avgRating: rating.avgRating.toFixed(1)
        };
      })
    );

    res.json({
      ratingTrend: ratingTrend.map(r => ({
        period: new Date(r._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avgRating: r.avgRating.toFixed(1),
        count: r.count
      })),
      commonIssues,
      qualityChange,
      topPrompts
    });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
