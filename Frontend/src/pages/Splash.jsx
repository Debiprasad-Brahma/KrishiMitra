import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000); // navigate after 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-logo">
        🌾 KrishiMitra
      </div>
      <p className="splash-tagline">
        Your AI Farming Assistant
      </p>
    </div>
  );
}
