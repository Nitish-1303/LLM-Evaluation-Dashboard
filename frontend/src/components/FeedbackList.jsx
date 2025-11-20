import React, { useState, useEffect } from 'react';

function FeedbackList({ apiUrl }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ minRating: '', maxRating: '', reviewer: '' });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxRating) params.append('maxRating', filters.maxRating);
      if (filters.reviewer) params.append('reviewer', filters.reviewer);

      const response = await fetch(`${apiUrl}/feedback?${params}`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${apiUrl}/feedback/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback-export.json';
      a.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  };

  const applyFilters = () => {
    setLoading(true);
    fetchFeedback();
  };

  if (loading) return <div className="loading">Loading feedback...</div>;

  return (
    <div className="feedback-list">
      <div className="feedback-header">
        <h2>All Feedback ({feedbacks.length})</h2>
        <button className="btn btn-secondary" onClick={handleExport}>
          Export JSON
        </button>
      </div>

      <div className="filters">
        <input
          type="number"
          placeholder="Min Rating"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          min="1"
          max="5"
        />
        <input
          type="number"
          placeholder="Max Rating"
          value={filters.maxRating}
          onChange={(e) => setFilters({ ...filters, maxRating: e.target.value })}
          min="1"
          max="5"
        />
        <input
          type="text"
          placeholder="Reviewer Name"
          value={filters.reviewer}
          onChange={(e) => setFilters({ ...filters, reviewer: e.target.value })}
        />
        <button className="btn btn-primary" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">No feedback found</div>
      ) : (
        <div className="feedback-items">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-item">
              <div className="feedback-meta">
                <span className="feedback-rating">
                  {'⭐'.repeat(feedback.rating)}
                </span>
                <span className="feedback-reviewer">{feedback.reviewer}</span>
                <span className="feedback-date">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              {feedback.taskId && (
                <div className="feedback-prompt">
                  <strong>Prompt:</strong> {feedback.taskId.prompt}
                </div>
              )}
              <div className="feedback-comments">{feedback.comments}</div>
              {feedback.correctedOutput && (
                <div className="feedback-correction">
                  <strong>Correction:</strong> {feedback.correctedOutput}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackList;
