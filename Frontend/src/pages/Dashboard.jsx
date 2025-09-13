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
    { title: "My Profile", icon: <User size={32} />, path: "/profile" },
    { title: "Digital Payments", icon: <DollarSign size={32} />, path: "/payments" },
    { title: "Logistics Support", icon: <Truck size={32} />, path: "/logistics" },
    { title: "Water & Irrigation", icon: <Droplets size={32} />, path: "/irrigation" },
    { title: "Training & Schemes", icon: <BookOpen size={32} />, path: "/training" },
    { title: "Market Trends", icon: <Globe2 size={32} />, path: "/trends" },
    { title: "Community Forum", icon: <Users size={32} />, path: "/forum" },
    { title: "Farmer Helpline", icon: <PhoneCall size={32} />, path: "/helpline" },
    { title: "Secure Ledger", icon: <ShieldCheck size={32} />, path: "/ledger" },
  ];

  return (
    <div className="dashboard-screen">
      <div className="overlay">
        <h1 className="dashboard-title">🌱 KrishiMitra Dashboard 🌾</h1>
        <div className="tiles-container">
          {tiles.map((tile) => (
            <TileAction
              key={tile.title}
              title={tile.title}
              icon={tile.icon}
              onClick={() => navigate(tile.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}