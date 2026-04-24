"use client";
import { motion } from "framer-motion";
import { Activity, Users, Zap, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AnalyticsView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      <h2 className="studio-title" style={{ marginBottom: 24, fontSize: 24 }}>Platform Analytics</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 30 }}>
        {[
          { label: "Active Users", value: "14,284", icon: Users, change: "+12.5%" },
          { label: "Total Playbooks Generated", value: "89,430", icon: Zap, change: "+34.2%" },
          { label: "Platform Revenue", value: "$45,290", icon: TrendingUp, change: "+8.4%" },
          { label: "System Uptime", value: "99.99%", icon: Activity, change: "Stable" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={itemVariants} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{stat.label}</span>
                <Icon size={16} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Archivo Black', sans-serif" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpRight size={14} /> {stat.change} this month
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="glass-card" style={{ height: 400, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 24, left: 24, fontSize: 16, fontWeight: 600 }}>Playbook Generation Volume</div>
        <div style={{ width: "90%", height: "70%", display: "flex", alignItems: "flex-end", gap: "2%", marginTop: 40 }}>
          {[30, 45, 25, 60, 80, 50, 90, 75, 100, 85, 65, 40].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }} 
              animate={{ height: `${h}%` }} 
              transition={{ duration: 1, delay: i * 0.05 }}
              style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "10%", background: "var(--text-primary)", opacity: 0.5 }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
