"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import PlaybookCards from "@/components/PlaybookCards";
import ContentStudio from "@/components/ContentStudio";
import RightPanel from "@/components/RightPanel";
import PlaybookModal from "@/components/PlaybookModal";
import AnalyticsView from "@/components/AnalyticsView";
import MySkillsView from "@/components/MySkillsView";
import InstalledSkillsView from "@/components/InstalledSkillsView";
import SettingsView from "@/components/SettingsView";
import XActionsView from "@/components/XActionsView";
import LineWaves from "@/components/LineWaves";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modal, setModal] = useState(null);

  // Smooth page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <motion.div key="project" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <PlaybookCards activeTab="project" onGenerate={(type, data) => setModal({ type, data })} />
          </motion.div>
        );
      case "founder":
        return (
          <motion.div key="founder" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <PlaybookCards activeTab="founder" onGenerate={(type, data) => setModal({ type, data })} />
          </motion.div>
        );
      case "studio":
        return (
          <motion.div key="studio" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <ContentStudio />
          </motion.div>
        );
      case "analytics":
        return (
          <motion.div key="analytics" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <AnalyticsView />
          </motion.div>
        );
      case "myskills":
        return (
          <motion.div key="myskills" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <MySkillsView />
          </motion.div>
        );
      case "installed":
        return (
          <motion.div key="installed" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <InstalledSkillsView />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <SettingsView />
          </motion.div>
        );
      case "xactions":
        return (
          <motion.div key="xactions" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
            <XActionsView />
          </motion.div>
        );
      case "dashboard":
      default:
        return (
          <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: "flex", gap: "24px", width: "100%" }}>
            <div className="content-center">
              <HeroSection setActiveTab={setActiveTab} />
              <ContentStudio />
            </div>
            <div className="content-right">
              <RightPanel />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="app-layout">
      <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "auto", opacity: 0.7 }}>
        <LineWaves
          speed={0.2}
          innerLineCount={28}
          outerLineCount={32}
          warpIntensity={1.2}
          rotation={-45}
          edgeFadeWidth={0.1}
          colorCycleSpeed={0.5}
          brightness={0.25}
          color1="#ffffff"
          color2="#cccccc"
          color3="#999999"
          enableMouseInteraction={true}
          mouseInfluence={3}
        />
      </div>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />
      <main className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {modal && (
          <PlaybookModal
            type={modal.type}
            data={modal.data}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
