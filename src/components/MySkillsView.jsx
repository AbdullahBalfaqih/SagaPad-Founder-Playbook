"use client";
import { motion } from "framer-motion";
import { Plus, Settings, Rocket, User, Share2 } from "lucide-react";

export default function MySkillsView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const MY_SKILLS = [
    { title: "X Growth Playbook", version: "v1.0", status: "Active", users: "1,247", icon: Rocket, rev: "$1,450" },
    { title: "Founder Personal Brand", version: "v1.2", status: "Active", users: "892", icon: User, rev: "$980" },
    { title: "Meme Coin Strategy", version: "v0.9", status: "Draft", users: "0", icon: Share2, rev: "$0" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="studio-title" style={{ fontSize: 24 }}>My Published Skills</h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
          <Plus size={16} /> Create New Skill
        </motion.button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {MY_SKILLS.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <motion.div key={i} variants={itemVariants} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} />
                </div>
                <div style={{ background: skill.status === "Active" ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                  {skill.status}
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{skill.title}</h3>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Version {skill.version}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: "auto" }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Active Users</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{skill.users}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Revenue Earned</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{skill.rev}</div>
                </div>
              </div>

              <button style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}>
                <Settings size={14} /> Manage Skill
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
