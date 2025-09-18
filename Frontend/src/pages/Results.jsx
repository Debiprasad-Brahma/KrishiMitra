import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ApiService from "../services/api";
import "./Results.css";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, image, answer, queryId } = location.state || {};
  
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = async (feedback) => {
    if (!queryId) return;
    
    try {
      await ApiService.giveFeedback(queryId, feedback);
      setFeedbackGiven(true);
      alert(`Thank you for your ${feedback} feedback!`);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const handleEscalate = () => {
    navigate("/escalation", { 
      state: { 
        originalQuery: query, 
        aiResponse: answer 
      } 
    });
  };

  return (
    <div className="results-screen">
      <h2>AI Analysis Result</h2>

      <div className="result-card">
        <h3>Your Query:</h3>
        <p>{query || "No query submitted"}</p>
        {image && (
          <div className="uploaded-image">
            <img src={image} alt="Uploaded" />
          </div>
        )}
      </div>

      <div className="result-card">
        <h3>AI Response:</h3>
        <div className="ai-response">
          {answer ? (
            <p>{answer}</p>
          ) : (
            <p>No response available. Please try submitting your query again.</p>
          )}
        </div>
      </div>

      {answer && !feedbackGiven && (
        <div className="feedback-buttons">
          <button 
            className="thumb-btn" 
            onClick={() => handleFeedback('positive')}
          >
            👍 Helpful
          </button>
          <button 
            className="thumb-btn" 
            onClick={() => handleFeedback('negative')}
          >
            👎 Not Helpful
          </button>
        </div>
      )}

      {feedbackGiven && (
        <div className="feedback-thanks">
          <p>✅ Thank you for your feedback!</p>
        </div>
      )}

      <button className="btn-escalate" onClick={handleEscalate}>
        Escalate to Officer
      </button>
    </div>
  );
}