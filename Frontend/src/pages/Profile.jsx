import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Globe, Edit2, Save, LogOut, History } from "lucide-react";
import ApiService from "../services/api";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    language: "english"
  });
  const [queryHistory, setQueryHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    loadProfile();
    loadQueryHistory();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setEditForm({
        name: userData.name || "",
        language: userData.language || "english"
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadQueryHistory = async () => {
    try {
      const response = await ApiService.getQueryHistory();
      if (response.success) {
        setQueryHistory(response.queries || []);
      }
    } catch (err) {
      console.error('Failed to load query history:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update local storage (in production, you'd call API)
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('lang', editForm.language);
      
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lang');
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="profile-screen">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h2>Farmer Profile</h2>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Query History
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-field">
                <div className="field-icon">
                  <User size={20} />
                </div>
                <div className="field-content">
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <span>{user.name || 'Not set'}</span>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <Phone size={20} />
                </div>
                <div className="field-content">
                  <label>Phone Number</label>
                  <span>{user.phone}</span>
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <Globe size={20} />
                </div>
                <div className="field-content">
                  <label>Language</label>
                  {isEditing ? (
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                    >
                      <option value="english">English</option>
                      <option value="malayalam">Malayalam</option>
                      <option value="hindi">Hindi</option>
                      <option value="tamil">Tamil</option>
                    </select>
                  ) : (
                    <span className="capitalize">{user.language || 'english'}</span>
                  )}
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{queryHistory.length}</div>
                <div className="stat-label">Total Queries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                </div>
                <div className="stat-label">Member Since</div>
              </div>
            </div>

            <button className="btn btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-content">
            <h3>
              <History size={20} />
              Query History
            </h3>
            {queryHistory.length === 0 ? (
              <div className="empty-state">
                <p>No queries yet. Start asking questions to see your history!</p>
              </div>
            ) : (
              <div className="history-list">
                {queryHistory.map((query, index) => (
                  <div key={query._id || index} className="history-item">
                    <div className="query-text">
                      <strong>Q:</strong> {query.question}
                    </div>
                    <div className="query-answer">
                      <strong>A:</strong> {query.answer}
                    </div>
                    <div className="query-meta">
                      <span className="query-date">
                        {formatDate(query.createdAt)}
                      </span>
                      <span className="query-language">
                        {query.language}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}