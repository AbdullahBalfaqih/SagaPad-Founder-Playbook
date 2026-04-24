"use client";
import { Settings, Bell, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TRENDING = [
  { name: "@aeyakovenko", desc: "New validator client update", posts: "2.1K posts", rank: 1 },
  { name: "@solana", desc: "Breakpoint 2025 announced", posts: "1.6K posts", rank: 2 },
  { name: "@SolanaFndn", desc: "Grants Round is live", posts: "980 posts", rank: 3 },
  { name: "@colosseum", desc: "Hackathon projects are shipping", posts: "870 posts", rank: 4 },
  { name: "@jupiterexchange", desc: "Jupiter AI updates", posts: "760 posts", rank: 5 },
];

const SPACES = [
  { name: "Solana Breakpoint Builders", date: "Apr 30, 8:00 PM UTC" },
  { name: "Colosseum Office Hours", date: "May 2, 6:00 PM UTC" },
  { name: "SolanaHub Community Call", date: "May 3, 9:00 PM UTC" },
];

const CHART_DATA = [25, 40, 35, 55, 60, 75, 90];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RightPanel() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* User Header */}
      <motion.div className="user-header" variants={itemVariants} style={{ justifyContent: "space-between" }}>
        <img src="/LOGO.png" alt="SagaPad" style={{ width: 34, height: 34, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }} />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="settings-icon"><Settings size={18} /></div>
          <div className="settings-icon"><Bell size={18} /></div>
          <div className="user-info">
            <div className="avatar">0x</div>
            <span className="username">0xJohn_Saga</span>
          </div>
        </div>
      </motion.div>

      {/* Playbook Impact */}
      <motion.div className="glass-card impact-card" id="impact-card" variants={itemVariants}>
        <div className="impact-header">
          <span className="card-title">Playbook Impact</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>This Week <ChevronDown size={12} /></span>
        </div>
        <div className="impact-grid">
          <div className="impact-stat">
            <div className="stat-label">Total Installs</div>
            <div className="stat-value">1,247</div>
            <div className="stat-change up">↑ 23.5%</div>
          </div>
          <div className="impact-stat">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">24.8K</div>
            <div className="stat-change up">↑ 31.2%</div>
          </div>
          <div className="impact-stat">
            <div className="stat-label">Total Likes</div>
            <div className="stat-value">3,456</div>
            <div className="stat-change up">↑ 18.7%</div>
          </div>
          <div className="impact-stat">
            <div className="stat-label">Bookmarks</div>
            <div className="stat-value">892</div>
            <div className="stat-change up">↑ 26.1%</div>
          </div>
        </div>
        <div className="mini-chart">
          {CHART_DATA.map((v, i) => (
            <motion.div 
              key={i} 
              className={`bar ${i >= 5 ? "active" : ""}`} 
              initial={{ height: 0 }}
              animate={{ height: `${v}%` }}
              transition={{ delay: 0.3 + (i * 0.05), duration: 0.5 }}
            />
          ))}
        </div>
        <div className="chart-labels">
          {DAYS.map((d) => (<span key={d}>{d}</span>))}
        </div>
      </motion.div>

      {/* Trending on X */}
      <motion.div className="glass-card trending-card" id="trending-card" variants={itemVariants}>
        <div className="card-header">
          <span className="card-title">Trending on X (Solana)</span>
        </div>
        {TRENDING.map((t) => (
          <div key={t.rank} className="trending-item">
            <div className={`trending-rank ${t.rank === 1 ? "gold" : t.rank === 2 ? "silver" : t.rank === 3 ? "bronze" : ""}`}>
              {t.rank}
            </div>
            <div className="trending-info">
              <div className="trending-name">{t.name}</div>
              <div className="trending-desc">{t.desc}</div>
            </div>
            <div className="trending-count">{t.posts}</div>
          </div>
        ))}
        <div className="view-all">View all trends <ArrowRight size={12} /></div>
      </motion.div>

      {/* Upcoming Spaces */}
      <motion.div className="glass-card spaces-card" id="spaces-card" variants={itemVariants}>
        <div className="card-header">
          <span className="card-title">Upcoming Spaces & AMAs</span>
        </div>
        {SPACES.map((s, i) => (
          <div key={i} className="space-item">
            <div className="space-info">
              <div className="space-name">{s.name}</div>
              <div className="space-date">{s.date}</div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="join-btn">Join</motion.button>
          </div>
        ))}
        <div className="view-all">View all events <ArrowRight size={12} /></div>
      </motion.div>
    </motion.div>
  );
}
