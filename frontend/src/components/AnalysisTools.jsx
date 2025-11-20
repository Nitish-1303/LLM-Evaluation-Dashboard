import React, { useState } from 'react';

function AnalysisTools({ apiUrl }) {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('sentiment');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (endpoint) => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/analysis/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-tools">
      <h2>🔬 Advanced Text Analysis</h2>
      
      <div className="analysis-tabs">
        <button 
          className={`tab ${activeTab === 'sentiment' ? 'active' : ''}`}
          onClick={() => { setActiveTab('sentiment'); setResult(null); }}
        >
          😊 Sentiment
        </button>
        <button 
          className={`tab ${activeTab === 'bias' ? 'active' : ''}`}
          onClick={() => { setActiveTab('bias'); setResult(null); }}
        >
          ⚖️ Bias Detection
        </button>
        <button 
          className={`tab ${activeTab === 'readability' ? 'active' : ''}`}
          onClick={() => { setActiveTab('readability'); setResult(null); }}
        >
          📖 Readability
        </button>
        <button 
          className={`tab ${activeTab === 'summarize' ? 'active' : ''}`}
          onClick={() => { setActiveTab('summarize'); setResult(null); }}
        >
          📝 Summarize
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
        rows={10}
        className="analysis-textarea"
      />

      <button 
        className="btn btn-primary"
        onClick={() => analyze(activeTab)}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : `Analyze ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
      </button>

      {result && (
        <div className="analysis-result">
          {activeTab === 'sentiment' && (
            <div className="sentiment-result">
              <h3>Sentiment Analysis</h3>
              <div className="sentiment-score">
                <div className="score-circle" style={{ borderColor: getSentimentColor(result.overall) }}>
                  <div className="score-value">{result.score}</div>
                  <div className="score-label">{result.overall}</div>
                </div>
              </div>
              <div className="sentiment-breakdown">
                <div className="breakdown-bar">
                  <span>Positive</span>
                  <div className="bar">
                    <div className="fill positive" style={{ width: `${result.breakdown.positive}%` }} />
                  </div>
                  <span>{result.breakdown.positive}%</span>
                </div>
                <div className="breakdown-bar">
                  <span>Negative</span>
                  <div className="bar">
                    <div className="fill negative" style={{ width: `${result.breakdown.negative}%` }} />
                  </div>
                  <span>{result.breakdown.negative}%</span>
                </div>
                <div className="breakdown-bar">
                  <span>Neutral</span>
                  <div className="bar">
                    <div className="fill neutral" style={{ width: `${result.breakdown.neutral}%` }} />
                  </div>
                  <span>{result.breakdown.neutral}%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bias' && (
            <div className="bias-result">
              <h3>Bias Detection</h3>
              <div className="bias-score">
                <span className={`risk-level risk-${result.riskLevel.toLowerCase()}`}>
                  {result.riskLevel} Risk
                </span>
                <span className="bias-score-value">Score: {result.biasScore}/100</span>
              </div>
              {result.detectedBiases.length > 0 && (
                <div className="detected-biases">
                  <h4>Detected Biases:</h4>
                  {result.detectedBiases.map((bias, idx) => (
                    <div key={idx} className="bias-item">
                      <strong>{bias.category}:</strong> {bias.words.join(', ')} ({bias.count} instances)
                    </div>
                  ))}
                </div>
              )}
              <p className="recommendation">{result.recommendation}</p>
            </div>
          )}

          {activeTab === 'readability' && (
            <div className="readability-result">
              <h3>Readability Analysis</h3>
              <div className="flesch-score">
                <div className="score-display">{result.fleschScore}</div>
                <div className="reading-level">{result.readingLevel}</div>
              </div>
              <div className="stats-grid">
                <div className="stat">
                  <span>Sentences:</span>
                  <strong>{result.statistics.sentences}</strong>
                </div>
                <div className="stat">
                  <span>Words:</span>
                  <strong>{result.statistics.words}</strong>
                </div>
                <div className="stat">
                  <span>Avg Words/Sentence:</span>
                  <strong>{result.statistics.avgWordsPerSentence}</strong>
                </div>
                <div className="stat">
                  <span>Avg Syllables/Word:</span>
                  <strong>{result.statistics.avgSyllablesPerWord}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summarize' && (
            <div className="summary-result">
              <h3>Text Summary</h3>
              <div className="summary-box">
                <p>{result.summary.text}</p>
              </div>
              <div className="summary-stats">
                <div>Compression: {result.compressionRatio}%</div>
                <div>Original: {result.original.words} words</div>
                <div>Summary: {result.summary.words} words</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getSentimentColor(sentiment) {
  if (sentiment === 'Positive') return '#10b981';
  if (sentiment === 'Negative') return '#ef4444';
  return '#6b7280';
}

export default AnalysisTools;
