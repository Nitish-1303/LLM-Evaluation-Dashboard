import React, { useState, useEffect } from 'react';

function TrendAnalysis({ apiUrl }) {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch(`${apiUrl}/trends`);
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Analyzing trends...</div>;
  if (!trends) return null;

  return (
    <div className="trend-analysis">
      <h2>📈 Trend Analysis</h2>

      <div className="trend-section">
        <h3>Rating Trends Over Time</h3>
        <div className="trend-chart">
          {trends.ratingTrend.map((point, idx) => (
            <div key={idx} className="trend-point">
              <div className="trend-bar" style={{ height: `${point.avgRating * 20}%` }}>
                <span className="trend-value">{point.avgRating}</span>
              </div>
              <div className="trend-label">{point.period}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="trend-section">
        <h3>Most Common Issues</h3>
        <div className="issues-list">
          {trends.commonIssues.map((issue, idx) => (
            <div key={idx} className="issue-item">
              <div className="issue-name">{issue.category}</div>
              <div className="issue-bar">
                <div className="issue-fill" style={{ width: `${issue.percentage}%` }} />
              </div>
              <div className="issue-count">{issue.count} mentions</div>
            </div>
          ))}
        </div>
      </div>

      <div className="trend-section">
        <h3>Quality Improvement</h3>
        <div className="improvement-metric">
          <div className="metric-value" style={{ color: trends.qualityChange >= 0 ? '#10b981' : '#ef4444' }}>
            {trends.qualityChange >= 0 ? '↑' : '↓'} {Math.abs(trends.qualityChange)}%
          </div>
          <div className="metric-label">
            {trends.qualityChange >= 0 ? 'Improvement' : 'Decline'} from last period
          </div>
        </div>
      </div>

      <div className="trend-section">
        <h3>Top Performing Prompts</h3>
        <div className="top-prompts">
          {trends.topPrompts.map((prompt, idx) => (
            <div key={idx} className="prompt-card">
              <div className="prompt-rank">#{idx + 1}</div>
              <div className="prompt-text">{prompt.text}</div>
              <div className="prompt-rating">⭐ {prompt.avgRating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendAnalysis;
