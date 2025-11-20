import React, { useState } from 'react';

function ComparisonTool({ apiUrl }) {
  const [texts, setTexts] = useState(['', '', '']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    const validTexts = texts.filter(t => t.trim().length > 0);
    if (validTexts.length < 2) {
      alert('Please enter at least 2 texts to compare');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/analysis/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: validTexts })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comparison-tool">
      <h2>🔄 AI Output Comparison</h2>
      <p className="subtitle">Compare multiple AI-generated responses side-by-side</p>

      <div className="comparison-inputs">
        {texts.map((text, index) => (
          <div key={index} className="comparison-input-box">
            <label>Response {index + 1}:</label>
            <textarea
              value={text}
              onChange={(e) => {
                const newTexts = [...texts];
                newTexts[index] = e.target.value;
                setTexts(newTexts);
              }}
              placeholder={`Paste AI response ${index + 1} here...`}
              rows={8}
            />
          </div>
        ))}
      </div>

      <button 
        className="btn btn-primary"
        onClick={handleCompare}
        disabled={loading}
      >
        {loading ? 'Comparing...' : '🔍 Compare Responses'}
      </button>

      {result && (
        <div className="comparison-results">
          <h3>Comparison Results</h3>
          
          <div className="comparison-grid">
            {result.analyses.map((analysis, idx) => (
              <div key={idx} className="comparison-card">
                <h4>Response {analysis.index}</h4>
                <div className="stat-row">
                  <span>Words:</span>
                  <span>{analysis.words}</span>
                </div>
                <div className="stat-row">
                  <span>Sentences:</span>
                  <span>{analysis.sentences}</span>
                </div>
                <div className="stat-row">
                  <span>Sentiment:</span>
                  <span className={`sentiment-${analysis.sentiment.overall.toLowerCase()}`}>
                    {analysis.sentiment.overall} ({analysis.sentiment.score})
                  </span>
                </div>
                <div className="stat-row">
                  <span>Readability:</span>
                  <span>{analysis.readability.fleschScore}</span>
                </div>
              </div>
            ))}
          </div>

          {result.similarities && (
            <div className="similarities">
              <h4>Similarity Scores:</h4>
              {result.similarities.map((sim, idx) => (
                <div key={idx} className="similarity-bar">
                  <span>Response {sim.text1} vs {sim.text2}:</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${sim.similarity}%` }}
                    />
                  </div>
                  <span>{sim.similarity}%</span>
                </div>
              ))}
            </div>
          )}

          {result.recommendation && (
            <div className="recommendation">
              <h4>🏆 Best Response:</h4>
              <p>Response {result.recommendation.index}</p>
              <p className="reason">{result.recommendation.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparisonTool;
