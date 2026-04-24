"use client";
import { motion } from "framer-motion";
import { Play, ShieldCheck, Cpu, Code2, Database } from "lucide-react";

export default function InstalledSkillsView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const INSTALLED_SKILLS = [
    { title: "Smart Contract Auditor", creator: "@cybershield", icon: ShieldCheck, status: "Up to date" },
    { title: "Tokenomics Simulator", creator: "@defi_wizard", icon: Cpu, status: "Update Available" },
    { title: "Solana Boilerplate Gen", creator: "@rust_god", icon: Code2, status: "Up to date" },
    { title: "Onchain Data Scraper", creator: "@data_ninja", icon: Database, status: "Up to date" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      <h2 className="studio-title" style={{ marginBottom: 24, fontSize: 24 }}>Installed Skills</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
        {INSTALLED_SKILLS.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <motion.div key={i} variants={itemVariants} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700 }}>{skill.title}</h3>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>by {skill.creator}</div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: skill.status === "Update Available" ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 500 }}>
                {skill.status}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className={skill.status === "Update Available" ? "btn-secondary" : "btn-primary"} 
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", marginTop: "auto" }}
              >
                {skill.status === "Update Available" ? "Update Skill" : <><Play size={14} /> Launch</>}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
