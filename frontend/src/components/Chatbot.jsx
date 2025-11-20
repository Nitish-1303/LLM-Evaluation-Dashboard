import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! I\'m your AI assistant. How can I help you with the LLM Evaluation Dashboard today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'How do I review tasks?',
    'What is AI detection?',
    'How to use the dashboard?',
    'Export feedback data'
  ];

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('review') || lowerMessage.includes('task')) {
      return 'To review tasks: Click on "Review Tasks" tab, select a task, rate it (1-5 stars), add comments, and submit your feedback. You can also regenerate AI outputs if needed!';
    } else if (lowerMessage.includes('ai detect') || lowerMessage.includes('detector')) {
      return 'The AI Detector analyzes text to determine if it\'s AI-generated or human-written. It uses 6 algorithms including linguistic analysis, sentiment detection, and can even identify which AI model (ChatGPT, Claude, Gemini, etc.) created the text!';
    } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('how to use')) {
      return 'The dashboard has 8 main sections: Dashboard (statistics), Review Tasks (evaluate AI outputs), All Feedback (browse reviews), AI Detector (check if text is AI-generated), Compare (side-by-side analysis), Analysis (sentiment/bias/readability), Leaderboard (top reviewers), and Trends (analytics over time).';
    } else if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      return 'To export feedback: Go to "All Feedback" tab and click the "Export JSON" button. This will download all feedback data in JSON format for further analysis.';
    } else if (lowerMessage.includes('leaderboard') || lowerMessage.includes('ranking')) {
      return 'The Leaderboard shows top reviewers ranked by their activity and quality. You can earn badges like Expert (50+ reviews), Veteran (20+ reviews), and Quality (4.5+ avg rating). Switch between Today, This Week, and All Time views!';
    } else if (lowerMessage.includes('trend') || lowerMessage.includes('analytics')) {
      return 'Trends Analysis shows rating changes over time, most common issues in feedback, quality improvement metrics, and top-performing prompts. It helps identify patterns and areas for improvement.';
    } else if (lowerMessage.includes('theme') || lowerMessage.includes('dark mode')) {
      return 'Toggle between light and dark themes using the moon/sun icon in the header. Your preference is saved automatically!';
    } else if (lowerMessage.includes('compare')) {
      return 'The Compare tool lets you analyze 2-3 AI outputs side-by-side. It shows word count, sentiment, readability scores, and similarity percentages to help you choose the best response.';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'I can help you with: reviewing tasks, understanding AI detection, using the dashboard features, exporting data, checking leaderboards, viewing trends, and more. What would you like to know?';
    } else {
      return 'I\'m here to help! You can ask me about reviewing tasks, AI detection, dashboard features, leaderboards, trends, or any other functionality. What would you like to know more about?';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getBotResponse(inputValue),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-title">AI Assistant</div>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message message-${message.type}`}>
                {message.type === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
                {message.type === 'user' && <div className="message-avatar">👤</div>}
              </div>
            ))}
            
            {isTyping && (
              <div className="message message-bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="chatbot-quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={!inputValue.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
