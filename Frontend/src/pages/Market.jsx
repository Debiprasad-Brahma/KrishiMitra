import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Market.css";
import { MapPin, DollarSign, Users, AlertTriangle } from "lucide-react";

export default function Market() {
  // Dummy local market data
  const buyers = [
    { name: "Rajesh Traders", location: "Bhubaneswar", crop: "Rice", price: 40 },
    { name: "Anil Agro", location: "Cuttack", crop: "Tomato", price: 25 },
    { name: "Sundar Farmers", location: "Puri", crop: "Potato", price: 18 },
  ];

  const alerts = [
    "Bulk buyer requests for Wheat in Bhubaneswar.",
    "Tomato price expected to rise in Cuttack next week.",
    "Government subsidy for pulses available this month."
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const tableRowVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const alertVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className="local-market-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="local-market-title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📍 Local Market Support
      </motion.h1>

      {/* Buyers Table */}
      <motion.section 
        className="buyers-section"
        variants={sectionVariants}
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Nearby Buyers & Vendors
        </motion.h2>
        <motion.table
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Crop</th>
              <th>Price (₹/kg)</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {buyers.map((buyer, index) => (
                <motion.tr
                  key={index}
                  custom={index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <td>{buyer.name}</td>
                  <td>{buyer.location}</td>
                  <td>{buyer.crop}</td>
                  <td>₹{buyer.price}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </motion.section>

      {/* Market Alerts */}
      <motion.section 
        className="alerts-section"
        variants={sectionVariants}
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            style={{ display: "inline-block" }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AlertTriangle size={20} />
          </motion.div>
          {" "}Market Alerts & Offers
        </motion.h2>
        <ul>
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.li
                key={index}
                custom={index}
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  x: 5,
                  transition: { duration: 0.2 }
                }}
              >
                {alert}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.section>

      {/* How It Helps */}
      <motion.section 
        className="benefits-section"
        variants={sectionVariants}
      >
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          How This Helps You
        </motion.h2>
        <ul>
          <AnimatePresence>
            {[
              "Direct connection with local buyers reduces middlemen.",
              "Know fair market prices for crops to maximize profit.",
              "Identify which crops are in demand locally.",
              "Get alerts on price trends, bulk requests, and government schemes."
            ].map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.9 + (index * 0.1), 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: 10,
                  color: "#2563eb",
                  transition: { duration: 0.2 }
                }}
              >
                {benefit}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.section>
    </motion.div>
  );
}
