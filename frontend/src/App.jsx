import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import ReviewModal from './components/ReviewModal';
import Dashboard from './components/Dashboard';
import FeedbackList from './components/FeedbackList';
import Login from './components/Login';
import AIDetector from './components/AIDetector';
import ComparisonTool from './components/ComparisonTool';
import AnalysisTools from './components/AnalysisTools';
import LeaderboardView from './components/LeaderboardView';
import TrendAnalysis from './components/TrendAnalysis';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('tasks');
  const [reviewer, setReviewer] = useState(null);

  useEffect(() => {
    const savedReviewer = localStorage.getItem('reviewer');
    if (savedReviewer) {
      setReviewer(savedReviewer);
    }
  }, []);

  useEffect(() => {
    if (reviewer && currentView === 'tasks') {
      fetchTasks();
    }
  }, [reviewer, currentView]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username) => {
    setReviewer(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('reviewer');
    setReviewer(null);
  };

  const handleReview = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleSubmitFeedback = async (feedback) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...feedback, reviewer })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setTasks(tasks.filter(t => t._id !== selectedTask._id));
      setSelectedTask(null);
    } catch (err) {
      throw err;
    }
  };

  const handleRegenerate = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask._id}/regenerate`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to regenerate output');
      
      const data = await response.json();
      setSelectedTask({ ...selectedTask, output: data.output });
    } catch (err) {
      throw err;
    }
  };

  if (!reviewer) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div>
            <h1>LLM Evaluation Dashboard</h1>
            <p className="subtitle">Review and provide feedback on AI-generated responses</p>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <span className="reviewer-name">👤 {reviewer}</span>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-tab ${currentView === 'tasks' ? 'active' : ''}`}
          onClick={() => setCurrentView('tasks')}
        >
          Review Tasks
        </button>
        <button 
          className={`nav-tab ${currentView === 'feedback' ? 'active' : ''}`}
          onClick={() => setCurrentView('feedback')}
        >
          All Feedback
        </button>
        <button 
          className={`nav-tab ${currentView === 'detector' ? 'active' : ''}`}
          onClick={() => setCurrentView('detector')}
        >
          🤖 AI Detector
        </button>
        <button 
          className={`nav-tab ${currentView === 'comparison' ? 'active' : ''}`}
          onClick={() => setCurrentView('comparison')}
        >
          🔄 Compare
        </button>
        <button 
          className={`nav-tab ${currentView === 'analysis' ? 'active' : ''}`}
          onClick={() => setCurrentView('analysis')}
        >
          🔬 Analysis
        </button>
        <button 
          className={`nav-tab ${currentView === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button 
          className={`nav-tab ${currentView === 'trends' ? 'active' : ''}`}
          onClick={() => setCurrentView('trends')}
        >
          📈 Trends
        </button>
      </nav>

      {currentView === 'tasks' && tasks.length === 0 && !loading && (
        <div className="admin-controls">
          <button 
            className="btn btn-primary"
            onClick={async () => {
              try {
                const response = await fetch(`${API_URL}/admin/seed`, { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                  alert(`✅ Added ${data.count} sample tasks!`);
                  fetchTasks();
                }
              } catch (err) {
                alert('Failed to add tasks');
              }
            }}
          >
            ➕ Add 20 Sample Tasks
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {currentView === 'dashboard' && <Dashboard apiUrl={API_URL} />}
      
      {currentView === 'tasks' && (
        <TaskList 
          tasks={tasks}
          loading={loading}
          onReview={handleReview}
        />
      )}

      {currentView === 'feedback' && <FeedbackList apiUrl={API_URL} />}

      {currentView === 'detector' && <AIDetector apiUrl={API_URL} />}

      {currentView === 'comparison' && <ComparisonTool apiUrl={API_URL} />}

      {currentView === 'analysis' && <AnalysisTools apiUrl={API_URL} />}

      {currentView === 'leaderboard' && <LeaderboardView apiUrl={API_URL} />}

      {currentView === 'trends' && <TrendAnalysis apiUrl={API_URL} />}

      {selectedTask && (
        <ReviewModal
          task={selectedTask}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFeedback}
          onRegenerate={handleRegenerate}
          defaultReviewer={reviewer}
        />
      )}
      
      <Chatbot />
    </div>
  );
}

export default App;
