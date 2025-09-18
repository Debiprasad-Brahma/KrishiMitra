import { useNavigate } from "react-router-dom";
import TileAction from "../components/TileAction";
import {
  CloudSun,
  BarChart2,
  Calendar,
  AlertTriangle,
  Bell,
  MessageSquare,
  DollarSign,
  Truck,
  Droplets,
  BookOpen,
  Globe2,
  Users,
  PhoneCall,
  ShieldCheck,
  User
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const tiles = [
    { title: "Ask AI", icon: <MessageSquare size={32} />, path: "/query" },
    { title: "Weather Updates", icon: <CloudSun size={32} />, path: "/weather" },
    { title: "Market Prices", icon: <BarChart2 size={32} />, path: "/market" },
    { title: "Crop Calendar", icon: <Calendar size={32} />, path: "/calendar" },
    { title: "Pest Alerts", icon: <AlertTriangle size={32} />, path: "/pest" },
    { title: "Notifications", icon: <Bell size={32} />, path: "/notifications" },
  ];

  return (
    <div className="dashboard-screen">
      <div className="overlay">
        {/* Profile Button - Top Right with inline styles to ensure positioning */}
        <div 
          className="profile-container"
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            zIndex: 1000
          }}
        >
          <button 
            className="profile-button"
            onClick={() => navigate("/profile")}
            aria-label="My Profile"
          >
            <User size={24} />
            <span className="profile-text">Profile</span>
          </button>
        </div>
        {/* Animated Title */}
        <h1 className="dashboard-title">
          <span className="title-emoji">🌱</span>
          <span className="title-text">KrishiMitra Dashboard</span>
          <span className="title-emoji">🌾</span>
        </h1>

        {/* Animated Tiles Container */}
        <div className="tiles-container">
          {tiles.map((tile, index) => (
            <div 
              key={tile.title}
              className="tile-wrapper"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <TileAction
                title={tile.title}
                icon={tile.icon}
                onClick={() => navigate(tile.path)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}