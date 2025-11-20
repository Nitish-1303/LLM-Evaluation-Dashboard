import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST /api/detect - Analyze text for AI generation
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Perform advanced analysis
    const analysis = await analyzeTextAdvanced(text);

    res.json(analysis);
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// POST /api/detect/batch - Analyze multiple texts
router.post('/batch', async (req, res) => {
  try {
    const { texts } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'Array of texts is required' });
    }

    const results = await Promise.all(
      texts.map(text => analyzeTextAdvanced(text))
    );

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze texts' });
  }
});

// Advanced multi-layered analysis
async function analyzeTextAdvanced(text) {
  const indicators = [];
  const metrics = {};
  let aiScore = 0;

  // 1. LINGUISTIC ANALYSIS
  const linguisticScore = analyzeLinguisticPatterns(text, indicators);
  aiScore += linguisticScore;
  metrics.linguistic = linguisticScore;

  // 2. STYLISTIC ANALYSIS
  const stylisticScore = analyzeStylePatterns(text, indicators);
  aiScore += stylisticScore;
  metrics.stylistic = stylisticScore;

  // 3. SEMANTIC ANALYSIS
  const semanticScore = analyzeSemanticPatterns(text, indicators);
  aiScore += semanticScore;
  metrics.semantic = semanticScore;

  // 4. STRUCTURAL ANALYSIS
  const structuralScore = analyzeStructuralPatterns(text, indicators);
  aiScore += structuralScore;
  metrics.structural = structuralScore;

  // 5. PERPLEXITY SIMULATION (simplified)
  const perplexityScore = analyzePerplexity(text, indicators);
  aiScore += perplexityScore;
  metrics.perplexity = perplexityScore;

  // 6. BURSTINESS ANALYSIS
  const burstinessScore = analyzeBurstiness(text, indicators);
  aiScore += burstinessScore;
  metrics.burstiness = burstinessScore;

  // 7. AI MODEL FINGERPRINTING
  const modelFingerprint = detectAIModel(text, indicators);

  // Calculate confidence level
  const confidence = calculateConfidence(indicators, text.length);

  // Normalize score to 0-100
  let aiProbability = Math.max(0, Math.min(100, 50 + aiScore));

  // Determine verdict with confidence
  const { verdict, riskLevel } = determineVerdict(aiProbability, confidence);

  // Generate detailed explanation
  const explanation = generateExplanation(aiProbability, indicators, metrics, confidence);

  // Calculate sentence-level analysis
  const sentenceAnalysis = analyzeSentences(text);

  return {
    aiProbability: Math.round(aiProbability),
    confidence: Math.round(confidence),
    verdict,
    riskLevel,
    indicators,
    metrics,
    modelFingerprint,
    sentenceAnalysis,
    explanation,
    timestamp: new Date().toISOString()
  };
}

// 1. Linguistic Pattern Analysis
function analyzeLinguisticPatterns(text, indicators) {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Advanced AI phrase detection
  const aiPhrases = {
    high: ['delve into', 'it is important to note', 'in the realm of', 'multifaceted', 'paradigm shift', 'holistic approach'],
    medium: ['furthermore', 'moreover', 'in conclusion', 'it should be noted', 'comprehensive', 'robust'],
    low: ['however', 'therefore', 'additionally', 'consequently']
  };

  let foundHigh = 0, foundMedium = 0, foundLow = 0;

  aiPhrases.high.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      foundHigh++;
      score += 20;
    }
  });

  aiPhrases.medium.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      foundMedium++;
      score += 10;
    }
  });

  aiPhrases.low.forEach(phrase => {
    if (lowerText.includes(phrase)) foundLow++;
  });

  if (foundHigh > 0) {
    indicators.push({
      type: 'ai',
      severity: 'high',
      text: `Contains ${foundHigh} high-confidence AI phrases (e.g., "delve into", "paradigm shift")`
    });
  }

  if (foundMedium > 2) {
    indicators.push({
      type: 'ai',
      severity: 'medium',
      text: `Frequent use of formal transitional phrases (${foundMedium} instances)`
    });
  }

  // Check for human-specific patterns
  const humanPhrases = ['i think', 'i feel', 'in my opinion', 'personally', 'i remember', 'when i was'];
  const foundHuman = humanPhrases.filter(phrase => lowerText.includes(phrase)).length;
  
  if (foundHuman > 0) {
    score -= 15 * foundHuman;
    indicators.push({
      type: 'human',
      severity: 'high',
      text: `Contains personal expressions and opinions (${foundHuman} instances)`
    });
  }

  return score;
}

// 2. Stylistic Pattern Analysis
function analyzeStylePatterns(text, indicators) {
  let score = 0;

  // Contraction analysis
  const contractions = (text.match(/\b(don't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|shouldn't|couldn't|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've)\b/gi) || []).length;
  const words = text.split(/\s+/).length;
  const contractionRate = contractions / words;

  if (contractionRate > 0.03) {
    score -= 15;
    indicators.push({
      type: 'human',
      severity: 'medium',
      text: `High contraction usage (${(contractionRate * 100).toFixed(1)}%) - typical of casual human writing`
    });
  } else if (text.length > 200 && contractionRate === 0) {
    score += 15;
    indicators.push({
      type: 'ai',
      severity: 'medium',
      text: 'No contractions in lengthy text - AI tends to write formally'
    });
  }

  // Punctuation variety
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const ellipsis = (text.match(/\.\.\./g) || []).length;

  if (exclamations > 2 || ellipsis > 1) {
    score -= 10;
    indicators.push({
      type: 'human',
      severity: 'low',
      text: 'Varied punctuation usage (exclamations, ellipsis) - human characteristic'
    });
  }

  // Emoji detection
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = (text.match(emojiRegex) || []).length;
  
  if (emojis > 0) {
    score -= 20;
    indicators.push({
      type: 'human',
      severity: 'high',
      text: `Contains emojis (${emojis}) - strong human indicator`
    });
  }

  return score;
}

// 3. Semantic Pattern Analysis
function analyzeSemanticPatterns(text, indicators) {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Check for repetitive vocabulary
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 5);
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordFreq).filter(([_, count]) => count > 3);
  if (repeatedWords.length > 2) {
    score += 15;
    indicators.push({
      type: 'ai',
      severity: 'medium',
      text: `Repetitive vocabulary - ${repeatedWords.length} words used 3+ times`
    });
  }

  // Lexical diversity
  const uniqueWords = new Set(words).size;
  const lexicalDiversity = uniqueWords / words.length;

  if (lexicalDiversity < 0.5 && words.length > 50) {
    score += 10;
    indicators.push({
      type: 'ai',
      severity: 'low',
      text: `Low lexical diversity (${(lexicalDiversity * 100).toFixed(1)}%) - limited vocabulary range`
    });
  } else if (lexicalDiversity > 0.75) {
    score -= 10;
    indicators.push({
      type: 'human',
      severity: 'low',
      text: `High lexical diversity (${(lexicalDiversity * 100).toFixed(1)}%) - rich vocabulary`
    });
  }

  // Check for typos and informal language
  const typos = /\b(teh|recieve|occured|seperate|definately|wierd|untill|alot)\b/i.test(text);
  const slang = /\b(gonna|wanna|gotta|kinda|sorta|yeah|nah|lol|omg|btw)\b/i.test(text);

  if (typos || slang) {
    score -= 20;
    indicators.push({
      type: 'human',
      severity: 'high',
      text: typos ? 'Contains common typos - strong human indicator' : 'Contains slang/informal language'
    });
  } else if (text.length > 300) {
    score += 8;
    indicators.push({
      type: 'ai',
      severity: 'low',
      text: 'Perfect spelling and formal language throughout'
    });
  }

  return score;
}

// 4. Structural Pattern Analysis
function analyzeStructuralPatterns(text, indicators) {
  let score = 0;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length < 2) return 0;

  // Sentence length analysis
  const lengths = sentences.map(s => s.trim().length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgLength;

  if (coefficientOfVariation < 0.3) {
    score += 20;
    indicators.push({
      type: 'ai',
      severity: 'high',
      text: `Very uniform sentence lengths (CV: ${coefficientOfVariation.toFixed(2)}) - AI characteristic`
    });
  } else if (coefficientOfVariation > 0.6) {
    score -= 15;
    indicators.push({
      type: 'human',
      severity: 'medium',
      text: `Highly varied sentence lengths (CV: ${coefficientOfVariation.toFixed(2)}) - human characteristic`
    });
  }

  // Paragraph structure
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length > 1) {
    const paraLengths = paragraphs.map(p => p.length);
    const paraVariance = paraLengths.reduce((sum, len) => sum + Math.pow(len - (paraLengths.reduce((a,b) => a+b, 0) / paraLengths.length), 2), 0) / paraLengths.length;
    
    if (paraVariance < 1000 && paragraphs.length > 2) {
      score += 10;
      indicators.push({
        type: 'ai',
        severity: 'low',
        text: 'Uniform paragraph structure - AI tends to balance content'
      });
    }
  }

  return score;
}

// 5. Perplexity Simulation
function analyzePerplexity(text, indicators) {
  let score = 0;

  // Simplified perplexity: measure predictability
  const words = text.toLowerCase().split(/\s+/);
  const bigrams = [];
  
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }

  // Common bigrams that AI uses frequently
  const commonAIBigrams = ['it is', 'in the', 'of the', 'to the', 'for the', 'on the', 'at the', 'by the', 'from the'];
  const aibigramCount = bigrams.filter(bg => commonAIBigrams.includes(bg)).length;
  const bigramRate = aibigramCount / bigrams.length;

  if (bigramRate > 0.15) {
    score += 12;
    indicators.push({
      type: 'ai',
      severity: 'medium',
      text: `High predictability (${(bigramRate * 100).toFixed(1)}% common bigrams) - low perplexity`
    });
  }

  return score;
}

// 6. Burstiness Analysis
function analyzeBurstiness(text, indicators) {
  let score = 0;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length < 3) return 0;

  // Measure variation in sentence complexity
  const complexities = sentences.map(s => {
    const words = s.split(/\s+/).length;
    const commas = (s.match(/,/g) || []).length;
    const clauses = commas + 1;
    return clauses / words; // Complexity ratio
  });

  const avgComplexity = complexities.reduce((a, b) => a + b, 0) / complexities.length;
  const complexityVariance = complexities.reduce((sum, c) => sum + Math.pow(c - avgComplexity, 2), 0) / complexities.length;

  if (complexityVariance < 0.001) {
    score += 15;
    indicators.push({
      type: 'ai',
      severity: 'medium',
      text: 'Low burstiness - consistent complexity throughout (AI trait)'
    });
  } else if (complexityVariance > 0.005) {
    score -= 15;
    indicators.push({
      type: 'human',
      severity: 'medium',
      text: 'High burstiness - varying complexity levels (human trait)'
    });
  }

  return score;
}

// Calculate confidence level
function calculateConfidence(indicators, textLength) {
  let confidence = 50;

  // More indicators = higher confidence
  confidence += Math.min(indicators.length * 3, 30);

  // Longer text = higher confidence
  if (textLength > 500) confidence += 15;
  else if (textLength > 200) confidence += 10;
  else if (textLength < 100) confidence -= 20;

  // High severity indicators increase confidence
  const highSeverity = indicators.filter(i => i.severity === 'high').length;
  confidence += highSeverity * 5;

  return Math.max(30, Math.min(95, confidence));
}

// Determine verdict with risk level
function determineVerdict(aiProbability, confidence) {
  let verdict, riskLevel;

  if (aiProbability >= 85) {
    verdict = 'Highly Likely AI-Generated';
    riskLevel = 'critical';
  } else if (aiProbability >= 70) {
    verdict = 'Likely AI-Generated';
    riskLevel = 'high';
  } else if (aiProbability >= 55) {
    verdict = 'Possibly AI-Generated';
    riskLevel = 'medium';
  } else if (aiProbability >= 40) {
    verdict = 'Uncertain - Mixed Signals';
    riskLevel = 'low';
  } else if (aiProbability >= 25) {
    verdict = 'Possibly Human-Written';
    riskLevel = 'low';
  } else if (aiProbability >= 15) {
    verdict = 'Likely Human-Written';
    riskLevel = 'minimal';
  } else {
    verdict = 'Highly Likely Human-Written';
    riskLevel = 'minimal';
  }

  // Adjust based on confidence
  if (confidence < 50) {
    verdict += ' (Low Confidence)';
  }

  return { verdict, riskLevel };
}

// Generate detailed explanation
function generateExplanation(aiProbability, indicators, metrics, confidence) {
  const aiIndicators = indicators.filter(i => i.type === 'ai').length;
  const humanIndicators = indicators.filter(i => i.type === 'human').length;

  let explanation = `Analysis completed with ${confidence}% confidence. `;
  explanation += `Found ${aiIndicators} AI indicators and ${humanIndicators} human indicators. `;

  if (aiProbability >= 70) {
    explanation += 'The text exhibits strong characteristics of AI-generated content including ';
    const topAI = indicators.filter(i => i.type === 'ai' && i.severity === 'high');
    if (topAI.length > 0) {
      explanation += topAI[0].text.toLowerCase() + '. ';
    }
  } else if (aiProbability <= 30) {
    explanation += 'The text shows clear signs of human authorship including ';
    const topHuman = indicators.filter(i => i.type === 'human' && i.severity === 'high');
    if (topHuman.length > 0) {
      explanation += topHuman[0].text.toLowerCase() + '. ';
    }
  } else {
    explanation += 'The text contains mixed signals making definitive classification difficult. ';
  }

  explanation += 'This advanced analysis uses linguistic patterns, stylistic markers, semantic analysis, structural patterns, perplexity simulation, and burstiness metrics.';

  return explanation;
}

// Sentence-level analysis
function analyzeSentences(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  return {
    total: sentences.length,
    avgLength: sentences.length > 0 ? Math.round(sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length) : 0,
    shortest: sentences.length > 0 ? Math.min(...sentences.map(s => s.length)) : 0,
    longest: sentences.length > 0 ? Math.max(...sentences.map(s => s.length)) : 0
  };
}

export default router;


// 7. AI Model Fingerprinting - Detect which AI model generated the text
function detectAIModel(text, indicators) {
  const lowerText = text.toLowerCase();
  const modelScores = {
    'ChatGPT': 0,
    'GPT-4': 0,
    'Claude': 0,
    'Gemini': 0,
    'Perplexity': 0,
    'Llama': 0,
    'Mistral': 0,
    'Bard': 0
  };

  // ChatGPT/GPT-4 Fingerprints
  const chatgptPatterns = {
    phrases: [
      'as an ai language model',
      'i don\'t have personal',
      'i cannot',
      'i\'m sorry, but',
      'it\'s important to note',
      'keep in mind',
      'it\'s worth noting',
      'delve into',
      'in the realm of',
      'multifaceted',
      'paradigm',
      'comprehensive approach'
    ],
    structure: {
      // ChatGPT loves numbered lists and structured responses
      hasNumberedList: /\n\d+\.\s/.test(text),
      hasBulletPoints: /\n[•\-\*]\s/.test(text),
      hasSubheadings: /\n#{1,3}\s/.test(text)
    },
    style: {
      // ChatGPT tends to be very balanced and diplomatic
      usesHowever: (text.match(/however/gi) || []).length,
      usesWhile: (text.match(/\bwhile\b/gi) || []).length,
      usesAlthough: (text.match(/although/gi) || []).length
    }
  };

  // Check ChatGPT patterns
  chatgptPatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['ChatGPT'] += 20;
      modelScores['GPT-4'] += 15;
    }
  });

  if (chatgptPatterns.structure.hasNumberedList) {
    modelScores['ChatGPT'] += 10;
    modelScores['GPT-4'] += 10;
  }

  if (chatgptPatterns.style.usesHowever > 1) {
    modelScores['ChatGPT'] += 8;
    modelScores['GPT-4'] += 8;
  }

  // Claude Fingerprints
  const claudePatterns = {
    phrases: [
      'i aim to',
      'i\'d be happy to',
      'i should note',
      'to be clear',
      'let me',
      'i want to be direct',
      'i think it\'s important',
      'nuanced',
      'thoughtful',
      'careful consideration'
    ],
    style: {
      // Claude is more conversational and uses "I" statements
      usesIStatements: (text.match(/\bi\s/gi) || []).length,
      usesLetMe: (text.match(/let me/gi) || []).length,
      // Claude often acknowledges complexity
      acknowledgesComplexity: /complex|nuanced|multifaceted|various perspectives/i.test(text)
    }
  };

  claudePatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['Claude'] += 18;
    }
  });

  if (claudePatterns.style.usesIStatements > 3) {
    modelScores['Claude'] += 12;
  }

  if (claudePatterns.style.acknowledgesComplexity) {
    modelScores['Claude'] += 10;
  }

  // Gemini (formerly Bard) Fingerprints
  const geminiPatterns = {
    phrases: [
      'i\'m a large language model',
      'i\'m still learning',
      'i\'m designed to',
      'my purpose is',
      'as a large language model',
      'i don\'t have access to',
      'i can\'t provide',
      'here are some',
      'here\'s what',
      'let\'s explore'
    ],
    style: {
      // Gemini tends to be more casual and uses emojis sometimes
      usesEmojis: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}]/gu.test(text),
      usesHereIs: (text.match(/here('s| is)/gi) || []).length,
      // Gemini often provides multiple options
      providesOptions: /option|alternative|another way|you could also/i.test(text)
    }
  };

  geminiPatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['Gemini'] += 20;
      modelScores['Bard'] += 20;
    }
  });

  if (geminiPatterns.style.usesHereIs > 1) {
    modelScores['Gemini'] += 10;
  }

  if (geminiPatterns.style.providesOptions) {
    modelScores['Gemini'] += 8;
  }

  // Perplexity Fingerprints
  const perplexityPatterns = {
    phrases: [
      'according to',
      'based on',
      'sources indicate',
      'research shows',
      'studies suggest',
      'data reveals',
      'evidence suggests',
      '[citation needed]',
      'as reported by',
      'recent findings'
    ],
    style: {
      // Perplexity heavily cites sources
      hasCitations: /\[\d+\]|\(\d{4}\)|according to|based on/i.test(text),
      hasLinks: /https?:\/\//i.test(text),
      // Perplexity is very factual and research-oriented
      isFactual: /study|research|data|evidence|findings|report/i.test(text)
    }
  };

  perplexityPatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['Perplexity'] += 15;
    }
  });

  if (perplexityPatterns.style.hasCitations) {
    modelScores['Perplexity'] += 25;
  }

  if (perplexityPatterns.style.hasLinks) {
    modelScores['Perplexity'] += 20;
  }

  // Llama Fingerprints
  const llamaPatterns = {
    phrases: [
      'as a helpful assistant',
      'i\'m here to help',
      'i\'d be glad to',
      'certainly',
      'of course',
      'absolutely'
    ],
    style: {
      // Llama tends to be very helpful and accommodating
      veryHelpful: /help|assist|glad|happy to|certainly|of course/gi.test(text),
      // Llama sometimes has more technical/direct responses
      technical: /function|method|process|system|implementation/i.test(text)
    }
  };

  llamaPatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['Llama'] += 12;
    }
  });

  // Mistral Fingerprints
  const mistralPatterns = {
    phrases: [
      'in summary',
      'to summarize',
      'key points',
      'main takeaways',
      'essentially',
      'fundamentally'
    ],
    style: {
      // Mistral tends to be concise and to-the-point
      concise: text.length < 500 && text.split(/[.!?]+/).length < 10,
      usesSummary: /summary|summarize|in short|briefly/i.test(text)
    }
  };

  mistralPatterns.phrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      modelScores['Mistral'] += 10;
    }
  });

  // Additional GPT-4 specific patterns (more sophisticated than ChatGPT)
  const gpt4Patterns = {
    // GPT-4 tends to use more sophisticated vocabulary
    sophisticatedWords: [
      'nuanced',
      'multifaceted',
      'paradigm',
      'holistic',
      'comprehensive',
      'intricate',
      'sophisticated',
      'elaborate',
      'intrinsic',
      'fundamental'
    ],
    // GPT-4 often provides deeper analysis
    deepAnalysis: /consider|analysis|perspective|implication|consequence|factor/i.test(text)
  };

  let sophisticatedCount = 0;
  gpt4Patterns.sophisticatedWords.forEach(word => {
    if (lowerText.includes(word)) {
      sophisticatedCount++;
      modelScores['GPT-4'] += 8;
      modelScores['ChatGPT'] += 3;
    }
  });

  if (gpt4Patterns.deepAnalysis && sophisticatedCount > 2) {
    modelScores['GPT-4'] += 15;
  }

  // Determine most likely model
  const sortedModels = Object.entries(modelScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0);

  let detectedModel = null;
  let confidence = 0;
  let alternativeModels = [];

  if (sortedModels.length > 0) {
    const [topModel, topScore] = sortedModels[0];
    
    // Calculate confidence based on score difference
    if (topScore >= 40) {
      detectedModel = topModel;
      confidence = Math.min(95, 50 + topScore);
      
      // Get alternative models with significant scores
      alternativeModels = sortedModels
        .slice(1, 4)
        .filter(([_, score]) => score >= 20)
        .map(([model, score]) => ({
          model,
          probability: Math.round((score / topScore) * 100)
        }));
    } else if (topScore >= 20) {
      detectedModel = topModel;
      confidence = 40 + topScore;
      alternativeModels = sortedModels
        .slice(1, 3)
        .filter(([_, score]) => score >= 15)
        .map(([model, score]) => ({
          model,
          probability: Math.round((score / topScore) * 100)
        }));
    }
  }

  // Add fingerprint indicators
  if (detectedModel) {
    indicators.push({
      type: 'fingerprint',
      severity: confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'low',
      text: `Detected ${detectedModel} fingerprint with ${Math.round(confidence)}% confidence`
    });
  }

  return {
    detectedModel,
    confidence: Math.round(confidence),
    allScores: modelScores,
    alternativeModels,
    explanation: detectedModel 
      ? `The text shows characteristics typical of ${detectedModel}. ${getModelExplanation(detectedModel)}`
      : 'No specific AI model fingerprint detected. The text may be human-written or from an unknown AI model.'
  };
}

// Get explanation for detected model
function getModelExplanation(model) {
  const explanations = {
    'ChatGPT': 'ChatGPT typically uses structured responses, balanced language, and phrases like "it\'s important to note" and "keep in mind".',
    'GPT-4': 'GPT-4 shows sophisticated vocabulary, deeper analysis, and more nuanced responses than ChatGPT-3.5.',
    'Claude': 'Claude tends to be more conversational, uses "I" statements frequently, and acknowledges complexity and nuance.',
    'Gemini': 'Gemini (formerly Bard) often uses casual language, provides multiple options, and phrases like "here\'s what" or "let\'s explore".',
    'Perplexity': 'Perplexity heavily cites sources, uses research-oriented language, and includes phrases like "according to" and "studies show".',
    'Llama': 'Llama tends to be very helpful and accommodating, using phrases like "I\'m here to help" and "certainly".',
    'Mistral': 'Mistral tends to be concise and direct, often using summary-oriented language.',
    'Bard': 'Bard (now Gemini) shows casual, exploratory language with multiple options and alternatives.'
  };

  return explanations[model] || '';
}
