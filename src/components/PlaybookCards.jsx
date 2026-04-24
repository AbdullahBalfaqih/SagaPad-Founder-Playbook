"use client";
import { useState } from "react";
import { ArrowRight, Target, CalendarDays, Mic, Lightbulb, PenTool, BookOpen, Layers, Type, CalendarClock, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaybookCards({ onGenerate, activeTab }) {
  const [projectForm, setProjectForm] = useState({
    project_name: "", project_description: "", target_audience: "", tech_stack: "", team_background: "",
  });
  const [founderForm, setFounderForm] = useState({
    founder_name: "", building: "", background: "", interests: "", communication_style: "",
  });

  const updateProject = (k, v) => setProjectForm((p) => ({ ...p, [k]: v }));
  const updateFounder = (k, v) => setFounderForm((p) => ({ ...p, [k]: v }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const renderProjectCard = () => (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="glass-card playbook-card">
      <div className="card-header">
        <div>
          <div className="card-title">Project Social Playbook</div>
          <div className="card-subtitle">Generate a 4-week social strategy for your hackathon project and grow from day zero.</div>
        </div>
      </div>
      <div className="playbook-form">
        <div className="form-group">
          <label>Project Name</label>
          <input placeholder="SolanaTicket" value={projectForm.project_name} onChange={(e) => updateProject("project_name", e.target.value)} />
        </div>
        <div className="form-group">
          <label>What does your project do?</label>
          <input placeholder="Onchain ticketing platform for events" value={projectForm.project_description} onChange={(e) => updateProject("project_description", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Who is it for?</label>
          <input placeholder="Event organizers and attendees" value={projectForm.target_audience} onChange={(e) => updateProject("target_audience", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tech Stack</label>
          <input placeholder="Solana, Next.js, Rust, Metaplex" value={projectForm.tech_stack} onChange={(e) => updateProject("tech_stack", e.target.value)} />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="generate-btn" onClick={() => onGenerate("project", projectForm)}>
          Generate Playbook <ArrowRight size={16} />
        </motion.button>
      </div>
      <div className="output-preview">
        <h4>Output Preview</h4>
        <div className="output-item"><div className="output-icon"><Target size={16} /></div><div><div className="output-label">Core Story Angle</div><div className="output-desc">What makes your project worth following</div></div></div>
        <div className="output-item"><div className="output-icon"><CalendarDays size={16} /></div><div><div className="output-label">4-Week Content Plan</div><div className="output-desc">16 posts • 4 themes • 4 formats</div></div></div>
        <div className="output-item"><div className="output-icon"><Mic size={16} /></div><div><div className="output-label">Spaces & AMAs</div><div className="output-desc">7 opportunities</div></div></div>
        <div className="output-item"><div className="output-icon"><Lightbulb size={16} /></div><div><div className="output-label">Engagement Strategy</div><div className="output-desc">Reply, quote, insert, connect</div></div></div>
        <div className="output-item"><div className="output-icon"><PenTool size={16} /></div><div><div className="output-label">First 5 Posts</div><div className="output-desc">Ready to publish</div></div></div>
      </div>
    </motion.div>
  );

  const renderFounderCard = () => (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="glass-card playbook-card">
      <div className="card-header">
        <div>
          <div className="card-title">Founder Personal Brand Playbook</div>
          <div className="card-subtitle">Build your unique voice and personal brand that people trust and follow.</div>
        </div>
      </div>
      <div className="playbook-form">
        <div className="form-group">
          <label>Founder Name</label>
          <input placeholder="John Doe" value={founderForm.founder_name} onChange={(e) => updateFounder("founder_name", e.target.value)} />
        </div>
        <div className="form-group">
          <label>What are you building?</label>
          <input placeholder="SolanaTicket" value={founderForm.building} onChange={(e) => updateFounder("building", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Your Background</label>
          <input placeholder="Full-stack builder & web3 explorer" value={founderForm.background} onChange={(e) => updateFounder("background", e.target.value)} />
        </div>
        <div className="form-group">
          <label>What do you care about most?</label>
          <input placeholder="DeFi, AI, Consumer Crypto..." value={founderForm.interests} onChange={(e) => updateFounder("interests", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Your Style</label>
          <select value={founderForm.communication_style} onChange={(e) => updateFounder("communication_style", e.target.value)}>
            <option value="">Select style...</option>
            <option value="Analytical">Analytical</option>
            <option value="Casual">Casual</option>
            <option value="Contrarian">Contrarian</option>
            <option value="Storyteller">Storyteller</option>
            <option value="Analytical + Honest + Storyteller">Analytical + Honest + Storyteller</option>
          </select>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="generate-btn" onClick={() => onGenerate("founder", founderForm)}>
          Generate Playbook <ArrowRight size={16} />
        </motion.button>
      </div>
      <div className="output-preview">
        <h4>Output Preview</h4>
        <div className="output-item"><div className="output-icon purple"><BookOpen size={16} /></div><div><div className="output-label">Unique POV</div><div className="output-desc">The perspective you should own</div></div></div>
        <div className="output-item"><div className="output-icon purple"><Layers size={16} /></div><div><div className="output-label">Content Pillars</div><div className="output-desc">4 pillars • Infinite content</div></div></div>
        <div className="output-item"><div className="output-icon purple"><Type size={16} /></div><div><div className="output-label">Writing Style Guide</div><div className="output-desc">Tone, structure, do's & don'ts</div></div></div>
        <div className="output-item"><div className="output-icon purple"><CalendarClock size={16} /></div><div><div className="output-label">Weekly Rhythm</div><div className="output-desc">6 posts/week • Mix of formats</div></div></div>
        <div className="output-item"><div className="output-icon purple"><Edit3 size={16} /></div><div><div className="output-label">First 10 Posts</div><div className="output-desc">Written in your voice</div></div></div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {activeTab === "dashboard" && (
        <motion.div key="grid" className="playbook-grid" initial="hidden" animate="visible" exit="exit" variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          exit: { opacity: 0 }
        }}>
          {renderProjectCard()}
          {renderFounderCard()}
        </motion.div>
      )}
      {activeTab === "project" && (
        <motion.div key="project" style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
          {renderProjectCard()}
        </motion.div>
      )}
      {activeTab === "founder" && (
        <motion.div key="founder" style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
          {renderFounderCard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
