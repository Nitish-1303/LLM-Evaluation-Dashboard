import express from 'express';

const router = express.Router();

// POST /api/analysis/sentiment - Analyze sentiment of text
router.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const sentiment = analyzeSentiment(text);
    res.json(sentiment);
  } catch (error) {
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

// POST /api/analysis/bias - Detect bias in text
router.post('/bias', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const biasAnalysis = detectBias(text);
    res.json(biasAnalysis);
  } catch (error) {
    res.status(500).json({ error: 'Bias detection failed' });
  }
});

// POST /api/analysis/summarize - Summarize text
router.post('/summarize', async (req, res) => {
  try {
    const { text, length = 'medium' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const summary = summarizeText(text, length);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// POST /api/analysis/readability - Check readability score
router.post('/readability', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const readability = analyzeReadability(text);
    res.json(readability);
  } catch (error) {
    res.status(500).json({ error: 'Readability analysis failed' });
  }
});

// POST /api/analysis/compare - Compare multiple texts
router.post('/compare', async (req, res) => {
  try {
    const { texts } = req.body;
    if (!texts || !Array.isArray(texts) || texts.length < 2) {
      return res.status(400).json({ error: 'At least 2 texts required' });
    }

    const comparison = compareTexts(texts);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

// Sentiment Analysis
function analyzeSentiment(text) {
  const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'perfect', 'outstanding', 'brilliant', 'superb'];
  const negative = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing', 'useless', 'fail', 'wrong'];
  const neutral = ['okay', 'fine', 'average', 'normal', 'standard', 'typical'];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  words.forEach(word => {
    if (positive.some(p => word.includes(p))) positiveCount++;
    if (negative.some(n => word.includes(n))) negativeCount++;
    if (neutral.some(n => word.includes(n))) neutralCount++;
  });

  const total = positiveCount + negativeCount + neutralCount || 1;
  const positivePercent = (positiveCount / total) * 100;
  const negativePercent = (negativeCount / total) * 100;
  const neutralPercent = (neutralCount / total) * 100;

  let overallSentiment = 'Neutral';
  let score = 50;

  if (positiveCount > negativeCount + neutralCount) {
    overallSentiment = 'Positive';
    score = 50 + (positivePercent / 2);
  } else if (negativeCount > positiveCount + neutralCount) {
    overallSentiment = 'Negative';
    score = 50 - (negativePercent / 2);
  }

  return {
    overall: overallSentiment,
    score: Math.round(score),
    breakdown: {
      positive: Math.round(positivePercent),
      negative: Math.round(negativePercent),
      neutral: Math.round(neutralPercent)
    },
    details: {
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      neutralWords: neutralCount
    }
  };
}

// Bias Detection
function detectBias(text) {
  const biasIndicators = {
    gender: ['he', 'she', 'his', 'her', 'man', 'woman', 'male', 'female', 'boy', 'girl'],
    political: ['liberal', 'conservative', 'left', 'right', 'democrat', 'republican'],
    racial: ['race', 'ethnic', 'minority', 'majority'],
    age: ['young', 'old', 'elderly', 'millennial', 'boomer'],
    religious: ['christian', 'muslim', 'jewish', 'hindu', 'atheist']
  };

  const lowerText = text.toLowerCase();
  const detectedBiases = [];
  let biasScore = 0;

  Object.entries(biasIndicators).forEach(([category, words]) => {
    const found = words.filter(word => lowerText.includes(word));
    if (found.length > 0) {
      detectedBiases.push({
        category,
        words: found,
        count: found.length
      });
      biasScore += found.length * 10;
    }
  });

  const stereotypes = ['always', 'never', 'all', 'none', 'every', 'typical'];
  const stereotypeCount = stereotypes.filter(s => lowerText.includes(s)).length;
  if (stereotypeCount > 2) {
    detectedBiases.push({
      category: 'stereotyping',
      words: stereotypes.filter(s => lowerText.includes(s)),
      count: stereotypeCount
    });
    biasScore += stereotypeCount * 5;
  }

  let riskLevel = 'Low';
  if (biasScore > 50) riskLevel = 'High';
  else if (biasScore > 25) riskLevel = 'Medium';

  return {
    biasScore: Math.min(100, biasScore),
    riskLevel,
    detectedBiases,
    recommendation: biasScore > 25 ? 'Consider reviewing for potential bias' : 'No significant bias detected'
  };
}

// Text Summarization
function summarizeText(text, length) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let summaryLength;
  switch(length) {
    case 'short': summaryLength = Math.ceil(sentences.length * 0.2); break;
    case 'long': summaryLength = Math.ceil(sentences.length * 0.5); break;
    default: summaryLength = Math.ceil(sentences.length * 0.3);
  }

  // Simple extractive summarization - take first and important sentences
  const summary = sentences.slice(0, Math.max(1, summaryLength)).join('. ') + '.';
  
  return {
    original: {
      length: text.length,
      sentences: sentences.length,
      words: text.split(/\s+/).length
    },
    summary: {
      text: summary,
      length: summary.length,
      sentences: summaryLength,
      words: summary.split(/\s+/).length
    },
    compressionRatio: Math.round((summary.length / text.length) * 100)
  };
}

// Readability Analysis
function analyzeReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease Score
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  let readingLevel;
  if (fleschScore >= 90) readingLevel = 'Very Easy (5th grade)';
  else if (fleschScore >= 80) readingLevel = 'Easy (6th grade)';
  else if (fleschScore >= 70) readingLevel = 'Fairly Easy (7th grade)';
  else if (fleschScore >= 60) readingLevel = 'Standard (8th-9th grade)';
  else if (fleschScore >= 50) readingLevel = 'Fairly Difficult (10th-12th grade)';
  else if (fleschScore >= 30) readingLevel = 'Difficult (College)';
  else readingLevel = 'Very Difficult (College graduate)';

  return {
    fleschScore: Math.max(0, Math.min(100, Math.round(fleschScore))),
    readingLevel,
    statistics: {
      sentences: sentences.length,
      words: words.length,
      syllables,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
      avgSyllablesPerWord: avgSyllablesPerWord.toFixed(1)
    }
  };
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Compare Texts
function compareTexts(texts) {
  const analyses = texts.map((text, index) => ({
    index: index + 1,
    length: text.length,
    words: text.split(/\s+/).length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    sentiment: analyzeSentiment(text),
    readability: analyzeReadability(text)
  }));

  // Find similarities
  const similarities = [];
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const similarity = calculateSimilarity(texts[i], texts[j]);
      similarities.push({
        text1: i + 1,
        text2: j + 1,
        similarity: Math.round(similarity)
      });
    }
  }

  return {
    analyses,
    similarities,
    recommendation: getBestText(analyses)
  };
}

function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return (intersection.size / union.size) * 100;
}

function getBestText(analyses) {
  const best = analyses.reduce((best, current) => {
    const score = current.sentiment.score + current.readability.fleschScore;
    const bestScore = best.sentiment.score + best.readability.fleschScore;
    return score > bestScore ? current : best;
  });

  return {
    index: best.index,
    reason: 'Best combination of positive sentiment and readability'
  };
}

export default router;
