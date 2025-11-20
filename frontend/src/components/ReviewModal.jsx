import React, { useState } from 'react';

function ReviewModal({ task, onClose, onSubmit, onRegenerate, defaultReviewer }) {
  const [rating, setRating] = useState(3);
  const [comments, setComments] = useState('');
  const [correctedOutput, setCorrectedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        rating: Number(rating),
        comments,
        correctedOutput: correctedOutput || undefined
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      await onRegenerate();
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Review Task</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Prompt:</label>
          <div className="output-box">{task.prompt}</div>
        </div>

        <div className="form-group">
          <label>Generated Output:</label>
          <div className="output-box">{task.output}</div>
          <button 
            className="btn btn-secondary"
            onClick={handleRegenerate}
            disabled={regenerating}
            style={{ marginTop: '10px' }}
          >
            {regenerating ? 'Regenerating...' : 'Regenerate Output'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5):</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Comments:</label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your feedback..."
              required
            />
          </div>

          <div className="form-group">
            <label>Corrected Output (optional):</label>
            <textarea 
              value={correctedOutput}
              onChange={(e) => setCorrectedOutput(e.target.value)}
              placeholder="Provide a corrected version if needed..."
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
