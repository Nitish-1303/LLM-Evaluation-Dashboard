import React from 'react';

function TaskList({ tasks, loading, onReview }) {
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No pending tasks</h3>
        <p>All tasks have been reviewed!</p>
      </div>
    );
  }

  const truncate = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="task-list">
      <h2 style={{ marginBottom: '20px' }}>Pending Tasks ({tasks.length})</h2>
      {tasks.map((task) => (
        <div key={task._id} className="task-item">
          <div className="task-content">
            <div className="task-prompt">{truncate(task.prompt, 80)}</div>
            <div className="task-output">{truncate(task.output, 120)}</div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onReview(task)}
          >
            Review
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
