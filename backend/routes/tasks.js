import express from 'express';
import Task from '../models/Task.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// GET /api/tasks - Get all pending tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks/:id/feedback - Submit feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const { rating, comments, correctedOutput, reviewer } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comments || comments.trim() === '') {
      return res.status(400).json({ error: 'Comments are required' });
    }
    if (!reviewer || reviewer.trim() === '') {
      return res.status(400).json({ error: 'Reviewer name is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create feedback
    const feedback = await Feedback.create({
      taskId: req.params.id,
      rating,
      comments,
      correctedOutput,
      reviewer
    });

    // Update task status
    task.status = 'reviewed';
    await task.save();

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// POST /api/tasks/:id/regenerate - Regenerate output (bonus)
router.post('/:id/regenerate', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Stub LLM call - in production, call OpenAI API
    const newOutput = `[Regenerated] ${task.output} (Updated at ${new Date().toLocaleTimeString()})`;
    
    task.output = newOutput;
    await task.save();

    res.json({ success: true, output: newOutput });
  } catch (error) {
    res.status(500).json({ error: 'Failed to regenerate output' });
  }
});

export default router;
