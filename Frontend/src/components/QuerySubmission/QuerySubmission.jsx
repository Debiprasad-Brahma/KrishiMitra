import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Send, Image } from "lucide-react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ApiService from "../../services/api";
import "./QuerySubmission.css";

export default function QuerySubmission() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { listening, transcript, toggleListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const handleSubmit = async () => {
    if (!query && !image) {
      setError("Please enter a query or upload an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const language = localStorage.getItem('lang') || 'english';
      
      const response = await ApiService.submitQuery(query, language, image);
      
      if (response.success) {
        navigate("/results", { 
          state: { 
            query, 
            image, 
            answer: response.answer,
            queryId: response.query._id
          } 
        });
      }
    } catch (err) {
      setError(err.message || "Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // In production, you'd upload this to your server/cloud storage
    }
  };

  return (
    <div className="query-screen">
      <h2>Ask AI</h2>
      <p className="query-desc">
        Get instant answers about crops, fertilizers, pests, irrigation, or market prices. You can also upload an image.
      </p>

      {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

      <div className="query-box">
        <input
          type="text"
          placeholder="Type your query or use microphone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button
          className={`mic-btn ${listening ? "listening" : ""}`}
          onClick={toggleListening}
          disabled={loading}
        >
          <Mic size={24} />
        </button>
        <button className="send-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : <Send size={24} />}
        </button>
      </div>

      <div className="image-upload">
        <label htmlFor="imageInput" className="image-label">
          <Image size={24} /> Upload Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          disabled={loading}
        />
        {image && (
          <div className="preview">
            <img src={image} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
}