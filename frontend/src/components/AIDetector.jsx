import React, { useState } from 'react';

function AIDetector({ apiUrl }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sampleTexts = {
    chatgpt: `It's important to note that artificial intelligence represents a significant paradigm shift in how we approach problem-solving. While AI systems can process vast amounts of data, it's worth noting that they still require human oversight. However, the technology continues to evolve rapidly. Keep in mind that AI should be viewed as a tool to augment human capabilities rather than replace them. In conclusion, the future of AI depends on responsible development and deployment.`,
    
    claude: `I aim to provide a thoughtful perspective on this topic. Let me be direct: AI development is a nuanced issue that requires careful consideration. I think it's important to acknowledge both the potential benefits and risks. To be clear, I want to emphasize that this is a complex topic with various perspectives. I'd be happy to explore different angles if you're interested in a more detailed discussion.`,
    
    gemini: `Here's what I can tell you about AI! I'm a large language model, and I'm designed to be helpful and informative. Let's explore this topic together. Here are some key points to consider: First, AI is rapidly advancing. Second, there are multiple applications across industries. You could also think about it from different perspectives - technical, ethical, and practical. What specific aspect would you like to know more about?`,
    
    perplexity: `According to recent studies, artificial intelligence has shown significant progress in natural language processing [1]. Research from Stanford University indicates that transformer models have achieved state-of-the-art results [2]. Based on data from multiple sources, the AI market is projected to grow substantially. Evidence suggests that machine learning applications are becoming increasingly sophisticated. Sources indicate that ethical considerations remain a primary concern in AI development.`,
    
    humanWritten: `I've been thinking about AI lately and honestly, it's kinda crazy how fast things are moving! Like, I remember when chatbots were super basic and couldn't understand anything. Now they're writing essays and stuff. Don't get me wrong - it's cool and all, but sometimes I wonder if we're moving too fast. What do you think? Are we gonna regret this later or is it gonna be awesome?`,
    
    mixed: `Artificial intelligence has transformed many industries. I personally witnessed this change when my company implemented AI tools last year. The efficiency gains were remarkable, though some colleagues felt uncertain about the technology. It's fascinating how AI can process data, but human creativity remains irreplaceable in my opinion.`
  };

  const loadSample = (type) => {
    setText(sampleTexts[type]);
    setResult(null);
    setError(null);
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('Failed to analyze text');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#ef4444'; // Red - High AI probability
    if (confidence >= 50) return '#f59e0b'; // Orange - Medium
    return '#10b981'; // Green - Low AI probability
  };

  const getModelLogo = (model) => {
    // Map model names to logo URLs (using CDN or local logos)
    const logos = {
      'ChatGPT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
      'GPT-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
      'Claude': 'https://www.anthropic.com/_next/image?url=%2Fimages%2Ficons%2Fclaude-avatar.png&w=96&q=75',
      'Gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
      'Perplexity': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png',
      'Llama': 'https://cdn-icons-png.flaticon.com/512/6295/6295417.png',
      'Mistral': 'https://mistral.ai/images/logo_hubc88c4ece131b91c7cb753f40e9e1cc5_2589_256x0_resize_q97_h2_lanczos_3.webp',
      'Bard': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg'
    };
    return logos[model] || null;
  };

  const getModelIcon = (model) => {
    const icons = {
      'ChatGPT': '💬',
      'GPT-4': '🧠',
      'Claude': '🎭',
      'Gemini': '✨',
      'Perplexity': '🔎',
      'Llama': '🦙',
      'Mistral': '🌬️',
      'Bard': '🎨'
    };
    return icons[model] || '🤖';
  };

  const getModelColor = (model) => {
    const colors = {
      'ChatGPT': '#10a37f',
      'GPT-4': '#8b5cf6',
      'Claude': '#cc785c',
      'Gemini': '#4285f4',
      'Perplexity': '#20808d',
      'Llama': '#0668e1',
      'Mistral': '#ff7000',
      'Bard': '#4285f4'
    };
    return colors[model] || '#667eea';
  };

  return (
    <div className="ai-detector">
      <div className="detector-header">
        <h2>AI Content Detector</h2>
        <p className="detector-subtitle">
          Enter text to check if it's AI-generated or human-written
        </p>
      </div>

      <div className="sample-texts">
        <h4>🧪 Try Sample Texts from Different AI Models:</h4>
        <div className="sample-buttons">
          <button 
            className="btn-sample ai-sample"
            onClick={() => loadSample('chatgpt')}
            style={{ borderColor: getModelColor('ChatGPT') }}
          >
            {getModelLogo('ChatGPT') && (
              <img 
                src={getModelLogo('ChatGPT')} 
                alt="ChatGPT"
                className="sample-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span>ChatGPT Sample</span>
          </button>
          <button 
            className="btn-sample ai-sample"
            onClick={() => loadSample('claude')}
            style={{ borderColor: getModelColor('Claude') }}
          >
            {getModelLogo('Claude') && (
              <img 
                src={getModelLogo('Claude')} 
                alt="Claude"
                className="sample-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span>Claude Sample</span>
          </button>
          <button 
            className="btn-sample ai-sample"
            onClick={() => loadSample('gemini')}
            style={{ borderColor: getModelColor('Gemini') }}
          >
            {getModelLogo('Gemini') && (
              <img 
                src={getModelLogo('Gemini')} 
                alt="Gemini"
                className="sample-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span>Gemini Sample</span>
          </button>
          <button 
            className="btn-sample ai-sample"
            onClick={() => loadSample('perplexity')}
            style={{ borderColor: getModelColor('Perplexity') }}
          >
            {getModelLogo('Perplexity') && (
              <img 
                src={getModelLogo('Perplexity')} 
                alt="Perplexity"
                className="sample-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span>Perplexity Sample</span>
          </button>
          <button 
            className="btn-sample human-sample"
            onClick={() => loadSample('humanWritten')}
          >
            <span>👤 Human Sample</span>
          </button>
          <button 
            className="btn-sample mixed-sample"
            onClick={() => loadSample('mixed')}
          >
            <span>🔀 Mixed Sample</span>
          </button>
        </div>
      </div>

      <div className="detector-input-section">
        <textarea
          className="detector-textarea"
          placeholder="Paste or type the text you want to analyze here... Or try one of the sample texts above!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        
        <div className="detector-actions">
          <button 
            className="btn btn-primary"
            onClick={analyzeText}
            disabled={loading || !text.trim()}
          >
            {loading ? '🔍 Analyzing...' : '🔍 Analyze Text'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setText('');
              setResult(null);
              setError(null);
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        <div className="text-stats">
          <span>📝 Characters: {text.length}</span>
          <span>📊 Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          <span>📄 Sentences: {text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0}</span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="detector-result">
          <div className="result-header">
            <h3>Advanced Analysis Result</h3>
            <span className={`risk-badge risk-${result.riskLevel}`}>
              {result.riskLevel?.toUpperCase()} RISK
            </span>
          </div>

          <div className="result-main">
            <div 
              className="confidence-circle"
              style={{ borderColor: getConfidenceColor(result.aiProbability) }}
            >
              <div className="confidence-value">
                {result.aiProbability}%
              </div>
              <div className="confidence-label">AI Probability</div>
            </div>

            <div className="result-verdict">
              <div className="verdict-label">Verdict:</div>
              <div 
                className="verdict-text"
                style={{ color: getConfidenceColor(result.aiProbability) }}
              >
                {result.verdict}
              </div>
              <div className="confidence-badge">
                Confidence: {result.confidence}%
              </div>
            </div>
          </div>

          {result.metrics && (
            <div className="metrics-grid">
              <h4>Analysis Metrics:</h4>
              <div className="metrics-cards">
                <div className="metric-card">
                  <div className="metric-label">Linguistic</div>
                  <div className="metric-value">{result.metrics.linguistic > 0 ? '+' : ''}{result.metrics.linguistic}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Stylistic</div>
                  <div className="metric-value">{result.metrics.stylistic > 0 ? '+' : ''}{result.metrics.stylistic}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Semantic</div>
                  <div className="metric-value">{result.metrics.semantic > 0 ? '+' : ''}{result.metrics.semantic}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Structural</div>
                  <div className="metric-value">{result.metrics.structural > 0 ? '+' : ''}{result.metrics.structural}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Perplexity</div>
                  <div className="metric-value">{result.metrics.perplexity > 0 ? '+' : ''}{result.metrics.perplexity}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Burstiness</div>
                  <div className="metric-value">{result.metrics.burstiness > 0 ? '+' : ''}{result.metrics.burstiness}</div>
                </div>
              </div>
            </div>
          )}

          {result.modelFingerprint && result.modelFingerprint.detectedModel && (
            <div 
              className="model-fingerprint"
              style={{ 
                background: `linear-gradient(135deg, ${getModelColor(result.modelFingerprint.detectedModel)} 0%, ${getModelColor(result.modelFingerprint.detectedModel)}dd 100%)`
              }}
            >
              <h4>🔍 AI Model Fingerprint Detection:</h4>
              <div className="fingerprint-main">
                <div className="detected-model">
                  <div className="model-logo-container">
                    {getModelLogo(result.modelFingerprint.detectedModel) ? (
                      <img 
                        src={getModelLogo(result.modelFingerprint.detectedModel)} 
                        alt={result.modelFingerprint.detectedModel}
                        className="model-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className="model-icon-fallback" style={{ display: getModelLogo(result.modelFingerprint.detectedModel) ? 'none' : 'block' }}>
                      {getModelIcon(result.modelFingerprint.detectedModel)}
                    </div>
                  </div>
                  <div className="model-info">
                    <div className="model-name">{result.modelFingerprint.detectedModel}</div>
                    <div className="model-confidence">
                      {result.modelFingerprint.confidence}% confidence
                    </div>
                  </div>
                </div>
                <div className="model-explanation">
                  {result.modelFingerprint.explanation}
                </div>
              </div>

              {result.modelFingerprint.alternativeModels && result.modelFingerprint.alternativeModels.length > 0 && (
                <div className="alternative-models">
                  <h5>Alternative Possibilities:</h5>
                  <div className="alt-models-list">
                    {result.modelFingerprint.alternativeModels.map((alt, index) => (
                      <div key={index} className="alt-model">
                        {getModelLogo(alt.model) ? (
                          <img 
                            src={getModelLogo(alt.model)} 
                            alt={alt.model}
                            className="alt-model-logo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                        ) : null}
                        <span className="alt-model-icon" style={{ display: getModelLogo(alt.model) ? 'none' : 'inline' }}>
                          {getModelIcon(alt.model)}
                        </span>
                        <span className="alt-model-name">{alt.model}</span>
                        <span className="alt-model-prob">{alt.probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.modelFingerprint.allScores && (
                <div className="all-scores">
                  <h5>All Model Scores:</h5>
                  <div className="scores-grid">
                    {Object.entries(result.modelFingerprint.allScores)
                      .sort((a, b) => b[1] - a[1])
                      .map(([model, score]) => (
                        <div key={model} className="score-bar">
                          <span className="score-model">
                            {getModelLogo(model) ? (
                              <img 
                                src={getModelLogo(model)} 
                                alt={model}
                                className="score-model-logo"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline';
                                }}
                              />
                            ) : null}
                            <span className="score-model-icon" style={{ display: getModelLogo(model) ? 'none' : 'inline' }}>
                              {getModelIcon(model)}
                            </span>
                            {model}
                          </span>
                          <div className="score-bar-container">
                            <div 
                              className="score-bar-fill"
                              style={{ 
                                width: `${Math.min(100, (score / 100) * 100)}%`,
                                background: score > 40 ? '#ef4444' : score > 20 ? '#f59e0b' : '#6b7280'
                              }}
                            />
                          </div>
                          <span className="score-value">{score}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {result.sentenceAnalysis && (
            <div className="sentence-analysis">
              <h4>Sentence Analysis:</h4>
              <div className="sentence-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Sentences:</span>
                  <span className="stat-value">{result.sentenceAnalysis.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Length:</span>
                  <span className="stat-value">{result.sentenceAnalysis.avgLength} chars</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Shortest:</span>
                  <span className="stat-value">{result.sentenceAnalysis.shortest} chars</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Longest:</span>
                  <span className="stat-value">{result.sentenceAnalysis.longest} chars</span>
                </div>
              </div>
            </div>
          )}

          <div className="result-details">
            <h4>Detection Indicators ({result.indicators.length}):</h4>
            <ul>
              {result.indicators.map((indicator, index) => (
                <li 
                  key={index}
                  className={`indicator-item severity-${indicator.severity}`}
                >
                  <span className="indicator-icon">
                    {indicator.type === 'ai' ? '🤖' : '👤'}
                  </span>
                  <span className="indicator-content">
                    <span className="indicator-text">{indicator.text}</span>
                    <span className={`severity-badge severity-${indicator.severity}`}>
                      {indicator.severity}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {result.explanation && (
            <div className="result-explanation">
              <h4>Detailed Explanation:</h4>
              <p>{result.explanation}</p>
            </div>
          )}

          <div className="result-disclaimer">
            <strong>⚡ Advanced Detection:</strong> This analysis uses 6 sophisticated algorithms: 
            Linguistic Pattern Analysis, Stylistic Markers, Semantic Analysis, Structural Patterns, 
            Perplexity Simulation, and Burstiness Metrics. For production use with 99%+ accuracy, 
            integrate with GPTZero API or OpenAI's classifier.
          </div>
        </div>
      )}
    </div>
  );
}

export default AIDetector;
