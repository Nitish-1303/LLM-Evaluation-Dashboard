import React, { useState, useEffect } from 'react';

function Dashboard({ apiUrl }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (!stats) return null;

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card reviewed">
          <div className="stat-value">{stats.reviewedTasks}</div>
          <div className="stat-label">Reviewed</div>
        </div>
        <div className="stat-card rating">
          <div className="stat-value">{stats.avgRating}</div>
          <div className="stat-label">Avg Rating</div>
        </div>
      </div>
      
      <div className="rating-distribution">
        <h3>Rating Distribution</h3>
        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="rating-bar-row">
              <span className="rating-label">{rating} ⭐</span>
              <div className="rating-bar-container">
                <div 
                  className="rating-bar-fill"
                  style={{ 
                    width: `${stats.totalFeedback > 0 ? (stats.ratingDistribution[rating] / stats.totalFeedback * 100) : 0}%` 
                  }}
                />
              </div>
              <span className="rating-count">{stats.ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
