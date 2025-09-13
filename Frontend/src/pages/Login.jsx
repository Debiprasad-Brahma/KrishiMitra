import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone.match(/^\d{10}$/)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.sendOTP(phone);
      if (response.success) {
        // For demo purposes, you can show the OTP in alert
        alert(`OTP sent: ${response.otp}`);
        navigate("/otp", { state: { phone } });
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <h2>Login to KrishiMitra</h2>
      {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSendOTP} disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  );
}