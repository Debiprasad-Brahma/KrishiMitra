import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../services/api";
import "./OTP.css";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.verifyOTP(phone, otp);
      if (response.success) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        navigate("/language");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-screen">
      <div className="otp-card">
        <h2>Verify Phone</h2>
        <p>OTP sent to {phone}</p>
        {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
          disabled={loading}
        />
        <button className="btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}