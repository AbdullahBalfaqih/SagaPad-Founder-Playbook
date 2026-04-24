"use client";
import { LayoutDashboard, Rocket, User, PenTool, BarChart3, Zap, Package, Settings, ArrowRight, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "project", icon: Rocket, label: "Project Playbook" },
  { id: "founder", icon: User, label: "Founder Playbook" },
  { id: "studio", icon: PenTool, label: "Content Studio" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "myskills", icon: Zap, label: "My Skills" },
  { id: "installed", icon: Package, label: "Installed Skills" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sidebar-logo">
            <img src="/LOGO.png" alt="SagaPad Logo" />
            <div>
              <h2>SagaPad</h2>
              <span>Skill Marketplace</span>
            </div>
          </motion.div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : ""}
            >
              <span className="icon"><Icon size={18} strokeWidth={1.8} /></span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div className="sidebar-section-title">Active Skill</div>
            <div className="sidebar-skill-card">
              <div className="skill-name">X Growth Playbook</div>
              <div className="skill-version">v1.0</div>
              <div className="skill-status">Active</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, fontFamily: "Inter, sans-serif" }}>
                Your AI-powered social strategy engine.
              </div>
            </div>

            <div className="sidebar-bottom">
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8, fontFamily: "Inter, sans-serif" }}>
                Powered by<br />
                <strong style={{ color: "var(--text-primary)" }}>SagaPad Skill Marketplace</strong>
              </div>
              <button className="explore-btn">
                Explore Skills <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
