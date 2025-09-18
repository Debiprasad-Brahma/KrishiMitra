import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [kishanId, setKishanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("phone"); // "phone" or "kishanId"

  const handleSendOTP = async () => {
    if (loginMethod === "phone" && !phone.match(/^\d{10}$/)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    if (loginMethod === "kishanId" && !kishanId.match(/^FM\d{6}$/)) {
      setError("Enter a valid Kishan ID (e.g., FM241234)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = loginMethod === "phone" 
        ? await ApiService.sendOTP(phone)
        : await ApiService.sendOTPByKishanId(kishanId);
      
      if (response.success) {
        // For demo purposes, you can show the OTP in alert
        alert(`OTP sent: ${response.otp}`);
        navigate("/otp", { state: { [loginMethod]: loginMethod === "phone" ? phone : kishanId } });
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const switchVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="auth-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={itemVariants}>
        Login to KrishiMitra
      </motion.h2>

      <motion.div 
        className="login-method-switch"
        variants={itemVariants}
        style={{ marginBottom: '1rem' }}
      >
        <motion.button
          onClick={() => setLoginMethod("phone")}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.25rem',
            border: loginMethod === "phone" ? '2px solid #007bff' : '1px solid #ccc',
            borderRadius: '4px',
            background: loginMethod === "phone" ? '#007bff' : 'transparent',
            color: loginMethod === "phone" ? 'white' : '#333',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Phone Number
        </motion.button>
        <motion.button
          onClick={() => setLoginMethod("kishanId")}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.25rem',
            border: loginMethod === "kishanId" ? '2px solid #007bff' : '1px solid #ccc',
            borderRadius: '4px',
            background: loginMethod === "kishanId" ? '#007bff' : 'transparent',
            color: loginMethod === "kishanId" ? 'white' : '#333',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Kishan ID
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            style={{color: 'red', marginBottom: '1rem'}}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loginMethod === "phone" ? (
          <motion.input
            key="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            variants={switchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        ) : (
          <motion.input
            key="kishanId"
            type="text"
            placeholder="Enter your Kishan ID (e.g., FM241234)"
            value={kishanId}
            onChange={(e) => setKishanId(e.target.value)}
            disabled={loading}
            variants={switchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>

      <motion.button 
        onClick={handleSendOTP} 
        disabled={loading}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {loading ? "Sending..." : "Send OTP"}
      </motion.button>
    </motion.div>
  );
}
