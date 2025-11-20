import React, { useState, useEffect } from 'react';

function LeaderboardView({ apiUrl }) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/leaderboard?timeframe=${timeframe}`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (!leaderboard) return null;

  return (
    <div className="leaderboard-view">
      <div className="leaderboard-header">
        <h2>🏆 Reviewer Leaderboard</h2>
        <div className="timeframe-selector">
          <button 
            className={`timeframe-btn ${timeframe === 'today' ? 'active' : ''}`}
            onClick={() => setTimeframe('today')}
          >
            Today
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="leaderboard-stats">
        <div className="stat-card">
          <div className="stat-value">{leaderboard.totalReviewers}</div>
          <div className="stat-label">Total Reviewers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leaderboard.totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leaderboard.avgReviewsPerReviewer}</div>
          <div className="stat-label">Avg Reviews/Reviewer</div>
        </div>
      </div>

      <div className="leaderboard-list">
        {leaderboard.topReviewers.map((reviewer, index) => (
          <div key={index} className={`leaderboard-item rank-${index + 1}`}>
            <div className="rank">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${index + 1}`}
            </div>
            <div className="reviewer-info">
              <div className="reviewer-name">{reviewer.name}</div>
              <div className="reviewer-stats">
                {reviewer.reviewCount} reviews • Avg rating: {reviewer.avgRating}
              </div>
            </div>
            <div className="reviewer-badges">
              {reviewer.badges.map((badge, idx) => (
                <span key={idx} className={`badge badge-${badge.type}`}>
                  {badge.icon} {badge.name}
                </span>
              ))}
            </div>
            <div className="reviewer-score">{reviewer.score} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardView;
