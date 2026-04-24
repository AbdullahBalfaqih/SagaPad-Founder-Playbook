"use client";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ setActiveTab }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hero-section" 
      id="hero"
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 className="hero-title">
          Win on X.<br />From Day Zero.
        </h1>
        <p className="hero-subtitle">
          AI-powered playbooks that help Solana projects
          and founders build audience, credibility, and momentum.
        </p>
        <div className="hero-buttons">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            onClick={() => setActiveTab("project")}
          >
            For Projects
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary" 
            onClick={() => setActiveTab("founder")}
          >
            For Founders
          </motion.button>
        </div>
      </div>
      
      <div className="hero-graphic" style={{ zIndex: 2 }}>
        <motion.img 
          initial={{ opacity: 0, scale: 0.8, y: 0 }}
          animate={{ opacity: 0.8, scale: 1, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            scale: { duration: 0.8, delay: 0.2 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
          }}
          src="/LOGO.png" 
          alt="SagaPad Logo" 
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.15))" }}
        />
      </div>
    </motion.section>
  );
}
