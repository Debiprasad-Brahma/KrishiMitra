import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Send, Image, X, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ApiService from "../../services/api";
import "./QuerySubmission.css";

export default function QuerySubmission() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { listening, transcript, toggleListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const handleSubmit = async () => {
    if (!query.trim() && images.length === 0) {
      setError(t('query.enterQuery'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const language = localStorage.getItem('lang') || 'english';
      
      let response;
      
      if (images.length > 0) {
        // Submit query with images
        response = await ApiService.submitQueryWithImages(query, language, images);
      } else {
        // Submit text-only query
        response = await ApiService.submitQuery(query, language);
      }
      
      if (response.success) {
        navigate("/results", { 
          state: { 
            query, 
            images: imagePreviews,
            answer: response.answer,
            queryId: response.query._id
          } 
        });
      }
    } catch (err) {
      setError(err.message || t('query.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (images.length + files.length > 5) {
      setError(t('query.maxImages'));
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      try {
        // Validate each file
        ApiService.validateImageFile(file);
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } catch (err) {
        setError(err.message);
        return;
      }
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setError(""); // Clear any previous errors
    }

    // Reset the input
    e.target.value = '';
  };

  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Camera capture function
  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create a modal or popup for camera preview (simplified approach)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current frame to canvas
        ctx.drawImage(video, 0, 0);
        
        // Convert to blob and create file
        canvas.toBlob((blob) => {
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          if (images.length >= 5) {
            setError(t('query.maxImages'));
            return;
          }
          
          setImages(prev => [...prev, file]);
          setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.8);
      });
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or not available');
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  return (
    <div className="query-screen">
      <h2>{t('query.title')}</h2>
      <p className="query-desc">
        {t('query.subtitle')}
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="query-box">
        <textarea
          placeholder={t('query.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          rows="3"
        />
        
        <div className="query-actions">
          <button
            className={`mic-btn ${listening ? "listening" : ""}`}
            onClick={toggleListening}
            disabled={loading}
            title={t('query.voice')}
          >
            <Mic size={20} />
          </button>
          
          <label htmlFor="imageInput" className="image-btn" title={t('query.uploadImage')}>
            <Image size={20} />
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              style={{ display: "none" }}
              disabled={loading}
            />
          </label>

          <button
            className="camera-btn"
            onClick={captureImage}
            disabled={loading}
            title="Capture from Camera"
          >
            <Camera size={20} />
          </button>
          
          <button 
            className="send-btn" 
            onClick={handleSubmit} 
            disabled={loading || (!query.trim() && images.length === 0)}
          >
            {loading ? (
              <div className="spinner">⏳</div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="image-previews">
          <h4>{t('common.images', 'Images')} ({imagePreviews.length}/5)</h4>
          <div className="preview-grid">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button
                  className="remove-image"
                  onClick={() => removeImage(index)}
                  disabled={loading}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>{t('query.analyzing')}</p>
          </div>
        </div>
      )}
    </div>
  );
}