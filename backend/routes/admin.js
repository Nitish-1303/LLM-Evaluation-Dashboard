import express from 'express';
import Task from '../models/Task.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST /api/admin/seed - Add sample tasks
router.post('/seed', async (req, res) => {
  try {
    const sampleTasks = [
      { prompt: "Explain quantum computing in simple terms", output: "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously." },
      { prompt: "Write a haiku about artificial intelligence", output: "Silicon minds think\nPatterns emerge from the code\nWisdom without soul" },
      { prompt: "What are the benefits of meditation?", output: "Meditation offers reduced stress, improved focus, and better emotional regulation." },
      { prompt: "Describe the water cycle", output: "The water cycle involves evaporation, condensation, precipitation, and collection." },
      { prompt: "How does photosynthesis work?", output: "Plants convert sunlight, water, and CO2 into glucose and oxygen using chlorophyll." },
      { prompt: "What is machine learning?", output: "Machine learning enables systems to learn from experience without explicit programming." },
      { prompt: "Explain blockchain technology", output: "Blockchain is a decentralized digital ledger with cryptographically linked blocks." },
      { prompt: "What causes climate change?", output: "Climate change is caused by greenhouse gas emissions from human activities." },
      { prompt: "How do vaccines work?", output: "Vaccines introduce weakened pathogens to trigger immune system antibody production." },
      { prompt: "What is the theory of relativity?", output: "Einstein's theory describes how space and time are relative to the observer." },
      { prompt: "Explain neural networks", output: "Neural networks are computing systems inspired by biological neural networks." },
      { prompt: "What is cryptocurrency?", output: "Cryptocurrency is digital currency using cryptography on blockchain networks." },
      { prompt: "How does the brain process information?", output: "The brain processes information through billions of interconnected neurons." },
      { prompt: "What is renewable energy?", output: "Renewable energy comes from naturally replenished sources like solar and wind." },
      { prompt: "Explain DNA", output: "DNA carries genetic instructions in a double helix structure." },
      { prompt: "What is cloud computing?", output: "Cloud computing delivers computing services over the internet on-demand." },
      { prompt: "How does 5G work?", output: "5G uses higher frequency radio waves for faster data transmission." },
      { prompt: "What is IoT?", output: "IoT is a network of connected devices that collect and exchange data." },
      { prompt: "Explain the greenhouse effect", output: "Greenhouse gases trap heat in Earth's atmosphere, warming the planet." },
      { prompt: "What is AGI?", output: "AGI is AI with human-level intelligence across all cognitive tasks." }
    ];

    const inserted = await Task.insertMany(sampleTasks);
    res.json({ success: true, message: `Added ${inserted.length} tasks`, count: inserted.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed tasks' });
  }
});

// POST /api/admin/seed-feedback - Add sample feedback
router.post('/seed-feedback', async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'pending' }).limit(10);
    if (tasks.length === 0) {
      return res.status(400).json({ error: 'No pending tasks. Add tasks first.' });
    }

    const samples = [
      { rating: 5, comments: "Excellent! Very clear.", reviewer: "Alice" },
      { rating: 4, comments: "Good, needs examples.", reviewer: "Bob" },
      { rating: 5, comments: "Perfect explanation.", reviewer: "Carol" },
      { rating: 3, comments: "Too technical.", reviewer: "David" },
      { rating: 4, comments: "Well written.", reviewer: "Emma" },
      { rating: 5, comments: "Outstanding!", reviewer: "Frank" },
      { rating: 2, comments: "Too vague.", reviewer: "Grace" },
      { rating: 4, comments: "Minor improvements needed.", reviewer: "Henry" },
      { rating: 5, comments: "Comprehensive.", reviewer: "Iris" },
      { rating: 3, comments: "Average response.", reviewer: "Jack" }
    ];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const sample = samples[i % samples.length];
      
      await Feedback.create({
        taskId: task._id,
        rating: sample.rating,
        comments: sample.comments,
        reviewer: sample.reviewer
      });

      task.status = 'reviewed';
      await task.save();
    }

    res.json({ success: true, message: `Added ${tasks.length} feedback entries`, count: tasks.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed feedback' });
  }
});

// DELETE /api/admin/reset
router.delete('/reset', async (req, res) => {
  try {
    await Task.deleteMany({});
    await Feedback.deleteMany({});
    res.json({ success: true, message: 'Database reset' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const reviewedTasks = await Task.countDocuments({ status: 'reviewed' });
    const totalFeedback = await Feedback.countDocuments();
    res.json({ totalTasks, pendingTasks, reviewedTasks, totalFeedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
