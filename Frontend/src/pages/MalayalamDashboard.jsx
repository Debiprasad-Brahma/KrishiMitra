import { useNavigate } from "react-router-dom";
import TileAction from "../components/TileAction";
import {
  CloudSun,
  BarChart2,
  Calendar,
  AlertTriangle,
  Bell,
  MessageSquare,
  User
} from "lucide-react";
import "./Dashboard.css";

export default function MalayalamDashboard() {
  const navigate = useNavigate();

  const tiles = [
    { title: "ചോദ്യങ്ങൾ ചോദിക്കുക", icon: <MessageSquare size={32} />, path: "/query" },
    { title: "കാലാവസ്ഥാ അപ്ഡേറ്റുകൾ", icon: <CloudSun size={32} />, path: "/weather" },
    { title: "വിപണി വിലകൾ", icon: <BarChart2 size={32} />, path: "/market" },
    { title: "വിള കലണ്ടർ", icon: <Calendar size={32} />, path: "/calendar" },
    { title: "കീട മുന്നറിയിപ്പുകൾ", icon: <AlertTriangle size={32} />, path: "/pest" },
    { title: "അറിയിപ്പുകൾ", icon: <Bell size={32} />, path: "/notifications" },
  ];

  return (
    <div className="dashboard-screen">
      <div className="overlay">
        {/* പ്രൊഫൈൽ ബട്ടൺ - മുകളിൽ വലത് വശം */}
        <div
          className="profile-container"
          style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 1000 }}
        >
          <button
            className="profile-button"
            onClick={() => navigate("/profile")}
            aria-label="എന്റെ പ്രൊഫൈൽ"
          >
            <User size={24} />
            <span className="profile-text">പ്രൊഫൈൽ</span>
          </button>
        </div>

        {/* ആനിമേറ്റഡ് തലക്കെട്ട് */}
        <h1 className="dashboard-title">
          <span className="title-emoji">🌱</span>
          <span className="title-text">കൃഷിമിത്ര ഡാഷ്ബോർഡ്</span>
          <span className="title-emoji">🌾</span>
        </h1>

        {/* ആനിമേറ്റഡ് ടൈലുകൾ */}
        <div className="tiles-container">
          {tiles.map((tile, index) => (
            <div
              key={tile.title}
              className="tile-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
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
