"use client";
import { motion } from "framer-motion";
import { Save, User, Wallet, Key } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from "react";

export default function SettingsView() {
  const { connected } = useWallet();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Load existing key or use the user's requested key as a fallback
    const savedKey = localStorage.getItem("openRouterApiKey");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setApiKey("");
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("openRouterApiKey", apiKey);
    alert("Settings saved successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <h2 className="studio-title" style={{ marginBottom: 24, fontSize: 24 }}>Platform Settings</h2>

      <div className="glass-card playbook-form" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><User size={18} /> Profile Settings</h3>
        <div className="form-group">
          <label>Display Name</label>
          <input defaultValue="0xJohn_Saga" />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea rows={3} defaultValue="Building the future of agentic skills on Solana." />
        </div>
      </div>

      <div className="glass-card playbook-form" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Wallet size={18} /> Wallet Integration</h3>
        <div className="form-group">
          <label>Connected Wallet (Solana)</label>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {/* The official button handles the entire flow (modal, connect, disconnect) */}
            <WalletMultiButton style={{ backgroundColor: connected ? "rgba(255,255,255,0.05)" : "var(--text-primary)", color: connected ? "var(--text-primary)" : "#000", fontFamily: "'Inter', sans-serif", borderRadius: 8, height: 44, border: connected ? "1px solid var(--border)" : "none" }} />
          </div>
        </div>
      </div>

      <div className="glass-card playbook-form" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Key size={18} /> API Keys</h3>
        <div className="form-group">
          <label>OpenRouter API Key</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-or-v1-..." 
          />
        </div>
      </div>

      <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Save size={16} /> Save Changes
      </motion.button>
    </motion.div>
  );
}
