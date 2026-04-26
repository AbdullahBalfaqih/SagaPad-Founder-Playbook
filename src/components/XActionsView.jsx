"use client";
import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import UserCarousel from "./UserCarousel";
import { 
  User, 
  Users, 
  MessageSquare, 
  Search, 
  Download, 
  Bookmark, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Loader2,
  ExternalLink,
  ChevronRight,
  Database,
  Settings,
  Cpu,
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  {
    id: "profile",
    title: "Profile Scraper",
    description: "Extract deep analytics and metadata from any X profile.",
    icon: User,
    color: "#3b82f6",
    fields: [{ name: "username", placeholder: "e.g. elonmusk", type: "text" }],
    script: `// XActions: Profile Scraper Console Snippet\n(async () => {\n  const username = prompt("Enter username:", "elonmusk");\n  console.log("Scraping profile for: " + username);\n  // Scraper logic here...\n})();`
  },
  {
    id: "tweets",
    title: "Tweet Scraper",
    description: "Download recent tweets and engagement metrics for analysis.",
    icon: MessageSquare,
    color: "#10b981",
    fields: [{ name: "username", placeholder: "e.g. nader", type: "text" }, { name: "count", placeholder: "Limit (default 20)", type: "number" }],
    script: `// XActions: Tweet Scraper Console Snippet\n(async () => {\n  const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]')).map(t => t.innerText);\n  console.log("Found " + tweets.length + " tweets.");\n  console.table(tweets);\n})();`
  },
  {
    id: "followers",
    title: "Audience Intel",
    description: "Map out followers and following lists without API keys.",
    icon: Users,
    color: "#8b5cf6",
    fields: [{ name: "username", placeholder: "e.g. jack", type: "text" }, { name: "type", options: ["followers", "following"] }],
    script: `// XActions: Unfollow/Follow Management\n(() => {\n  const $followButtons = '[data-testid$="-unfollow"]';\n  const buttons = document.querySelectorAll($followButtons);\n  console.log("Found " + buttons.length + " accounts to manage.");\n})();`
  },
  {
    id: "search",
    title: "Deep Search",
    description: "Advanced query-based tweet extraction and trend mapping.",
    icon: Search,
    color: "#f59e0b",
    fields: [{ name: "query", placeholder: "e.g. #Solana Hackathon", type: "text" }],
    script: `// XActions: Search Scraper\nconsole.log("Initiating deep search...");\n// Automation logic for search results...`
  },
  {
    id: "media",
    title: "Video Downloader",
    description: "Extract high-quality MP4 links from any tweet URL.",
    icon: Download,
    color: "#ef4444",
    fields: [{ name: "url", placeholder: "https://x.com/.../status/...", type: "text" }],
    script: `// XActions: Media Extractor\n(() => {\n  const video = document.querySelector('video');\n  if (video) console.log("Video source found: " + video.src);\n  else console.log("No video found on page.");\n})();`
  },
  {
    id: "bookmarks",
    title: "Bookmark Export",
    description: "Securely export your saved bookmarks for external backup.",
    icon: Bookmark,
    color: "#ec4899",
    fields: [],
    script: `// XActions: Bookmark Exporter\n(async () => {\n  console.log("Exporting bookmarks...");\n  // Scroll and collect logic...\n})();`
  },
  {
    id: "retweeters",
    title: "Retweet Tracker",
    description: "Identify all users who retweeted a specific tweet URL.",
    icon: Zap,
    color: "#8b5cf6",
    fields: [
      { name: "url", placeholder: "https://x.com/.../status/...", type: "text" },
      { name: "limit", placeholder: "Limit (default 50)", type: "text" }
    ],
    script: `// XActions: Retweet Tracker\n(async () => {\n  const url = window.location.href + "/retweets";\n  window.location.href = url;\n})();`
  }
];

export default function XActionsView() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logs, setLogs] = useState([
    { type: "system", text: "XActions v3.1.0 initialized successfully." },
    { type: "info", text: "Browser automation engine: Standby" },
    { type: "info", text: "Local MCP Server: Listening on port 3000" }
  ]);
  const [results, setResults] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (text, type = "info") => {
    setLogs(prev => [...prev, { type, text, time: new Date().toLocaleTimeString() }]);
  };

  const handleAction = async (actionId, formData) => {
    setLoading(true);
    setResults(null);
    addLog(`Initiating ${actionId} action...`, "info");
    
    // Simulate API call to the xactions engine
    try {
      const response = await fetch("/api/x", {
        method: "POST",
        body: JSON.stringify({ action: actionId, data: formData, authToken }),
        headers: { "Content-Type": "application/json" }
      });
      
      const resData = await response.json();
      
      if (resData.success) {
        addLog(`Successfully completed ${actionId} scrape.`, "success");
        setResults(resData.payload);
      } else {
        addLog(`ERROR: ${resData.error || "Execution failed."}`, "error");
      }
    } catch (err) {
      addLog(`Network error during execution.`, "error");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!results) return;
    
    // Extract payload from response if nested
    const data = results.payload || results;
    
    // Normalize data for excel
    let dataToExport = [];
    if (Array.isArray(data)) {
      dataToExport = data;
    } else {
      dataToExport = [data];
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "XActions_Results");
    
    const fileName = `XActions_${selectedAction?.id || "data"}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    addLog(`Excel file "${fileName}" generated and download started.`, "success");
  };

  const renderResults = () => {
    if (!results) return null;
    const data = results.payload || results;

    // If it's a list of users (e.g. followers, retweeters)
    if (Array.isArray(data) && data.length > 0 && data[0].username && !data[0].text) {
      return <UserCarousel users={data} />;
    }

    // If it's a list of tweets
    if (Array.isArray(data)) {
      return (
        <div className="results-list">
          {data.map((item, i) => (
            <motion.div 
              key={i} 
              className="result-item glassy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {item.username ? (
                // User Card
                <div className="user-result">
                  <div className="user-avatar">
                    {item.avatar ? <img src={item.avatar} alt="" /> : <User size={20} />}
                  </div>
                  <div className="user-details">
                    <div className="user-main">
                      <span className="user-name">{item.name || item.username}</span>
                      <span className="user-handle">@{item.username}</span>
                    </div>
                    {item.bio && <p className="user-bio">{item.bio}</p>}
                  </div>
                </div>
              ) : (
                // Tweet Card
                <div className="tweet-result">
                  <div className="tweet-header">
                    <div className="tweet-author">
                      <span className="author-handle">@{item.author || "unknown"}</span>
                      {item.timestamp && <span className="tweet-date">• {new Date(item.timestamp).toLocaleDateString()}</span>}
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="tweet-link">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="tweet-text">{item.text}</p>
                  {item.videoUrl && (
                    <div className="tweet-media">
                      <video controls src={item.videoUrl} className="media-player" />
                    </div>
                  )}
                  {item.imageUrls && item.imageUrls.length > 0 && (
                    <div className="tweet-media images">
                      {item.imageUrls.slice(0, 2).map((img, idx) => (
                        <img key={idx} src={img} alt="" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    // Single object (e.g. Profile or Media)
    if (typeof data === 'object' && data !== null) {
      // Profile View
      if (data.username) {
        return (
          <div className="profile-result glassy">
             <div className="profile-banner"></div>
             <div className="profile-header">
               <div className="profile-avatar">
                 {data.avatar ? <img src={data.avatar} alt="" /> : <User size={40} />}
               </div>
               <div className="profile-info">
                 <h2>{data.name}</h2>
                 <p className="handle">@{data.username}</p>
               </div>
             </div>
             <p className="bio">{data.bio}</p>
             <div className="profile-stats">
                <div className="stat"><strong>{data.followers || 0}</strong> Followers</div>
                <div className="stat"><strong>{data.following || 0}</strong> Following</div>
             </div>
          </div>
        );
      }

      // Media Downloader View
      if (data.type === 'video' || data.videoUrl || data.imageUrls) {
        return (
          <div className="media-result glassy">
            <h3 className="media-title">
              {data.type === 'video' ? 'Video Detected' : 'Images Detected'}
            </h3>
            {data.videoUrl ? (
              <div className="video-player-container">
                <video controls className="premium-player" src={data.videoUrl}>
                  Your browser does not support the video tag.
                </video>
                <div className="media-actions">
                  <a href={data.videoUrl} download className="download-btn">
                    Download MP4
                  </a>
                </div>
              </div>
            ) : data.imageUrls && data.imageUrls.length > 0 ? (
              <div className="image-grid-large">
                {data.imageUrls.map((url, i) => (
                  <div key={i} className="image-item">
                    <img src={url} alt="" />
                    <a href={url} target="_blank" rel="noreferrer" className="overlay-btn">View Full</a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-media">No playable media found at this URL.</p>
            )}
          </div>
        );
      }
    }

    return (
      <pre className="results-preview">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="xactions-container">
      <div className="header-top">
        <div className="header-brand">
          <h1 className="logo-text">XActions<span>.ai</span></h1>
          <p className="logo-tagline">Advanced OSINT & Media Extraction</p>
        </div>
        
        <div className="header-actions">
          <button 
            className={`settings-trigger ${authToken ? 'active' : ''}`}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={20} />
            {authToken && <span className="settings-badge"></span>}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="settings-overlay">
            <motion.div 
              className="settings-modal glassy"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="settings-header">
                <div className="title-group">
                  <Settings className="title-icon" size={20} />
                  <h3>Platform Settings</h3>
                </div>
                <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="settings-body">
                <div className="settings-section">
                  <label>Engine Status</label>
                  <div className="status-grid">
                    <div className="status-pill glassy">
                      <ShieldCheck size={16} />
                      <span>No API Required</span>
                    </div>
                    <div className="status-pill glassy active">
                      <Cpu size={16} />
                      <span>Engine Ready</span>
                      <span className="pulse"></span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <label>Authentication (X Auth Token)</label>
                  <p className="field-desc">Required for private data (Followers, Retweeters, Bookmarks).</p>
                  <div className="auth-input-group">
                    <ShieldCheck size={18} className="input-icon" />
                    <input 
                      type="password" 
                      placeholder="Paste your auth_token here..."
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="settings-footer">
                <button className="save-btn" onClick={() => setIsSettingsOpen(false)}>
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="module-navbar glassy">
        {ACTIONS.map((action) => (
          <motion.div 
            key={action.id}
            className={`nav-item ${selectedAction?.id === action.id ? "active" : ""}`}
            onClick={() => setSelectedAction(action)}
            whileHover={{ y: -2 }}
            style={{ position: 'relative' }}
          >
            <div className="nav-icon">
              <action.icon size={16} />
            </div>
            <span>{action.title}</span>
            {selectedAction?.id === action.id && (
              <motion.div 
                layoutId="nav-indicator" 
                className="active-indicator"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="workspace-area">
        <div className="workspace-column">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedAction?.id || "empty"}
              className="workspace-card glassy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedAction ? (
              <div className="action-form">
                <div className="form-header">
                  <div className="icon" style={{ backgroundColor: `${selectedAction.color}20`, color: selectedAction.color }}>
                    <selectedAction.icon size={24} />
                  </div>
                  <div>
                    <h2>{selectedAction.title}</h2>
                    <p>{selectedAction.description}</p>
                  </div>
                </div>
                
                <div className="inputs-grid">
                  {selectedAction.fields.map(field => (
                    <div key={field.name} className="input-group">
                      <label>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
                      {field.options ? (
                        <select id={field.name}>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} id={field.name} placeholder={field.placeholder} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <button 
                    className="execute-btn" 
                    disabled={loading}
                    onClick={() => {
                      const data = {};
                      selectedAction.fields.forEach(f => {
                        data[f.name] = document.getElementById(f.name)?.value;
                      });
                      handleAction(selectedAction.id, data);
                    }}
                  >
                    {loading ? <Loader2 className="spin" size={18} /> : <Terminal size={18} />}
                    <span>Execute {selectedAction.title} (Node)</span>
                  </button>
                  
                  <button 
                    className="script-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAction.script);
                      addLog("Copied browser console script to clipboard.", "system");
                    }}
                  >
                    <ExternalLink size={18} />
                    <span>Copy Console Script (Browser)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-workspace">
                <Database size={48} strokeWidth={1} />
                <h3>No Module Selected</h3>
                <p>Select a module from the left to begin automation</p>
              </div>
            )}

            <div className="terminal-section">
              <div className="terminal-header">
                <div className="dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="title">xactions@system: ~</div>
              </div>
              <div className="terminal-body">
                {logs.map((log, i) => (
                  <div key={i} className={`log-line ${log.type}`}>
                    <span className="timestamp">[{log.time || "00:00:00"}]</span>
                    <span className="type">{log.type.toUpperCase()}:</span>
                    <span className="text">{log.text}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
          
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="results-card"
            >
              <div className="results-header">
                <h3>Execution Results</h3>
                <div className="export-buttons">
                  <button className="download-results" onClick={exportToExcel}>
                    <Database size={14} /> Export Excel
                  </button>
                  <button className="download-results">
                    <ExternalLink size={14} /> Export JSON
                  </button>
                </div>
              </div>
              
              <div className="results-container-styled">
                {renderResults()}
              </div>
            </motion.div>
          )}
        </div>

      <style jsx>{`
        .xactions-container {
          padding: 32px;
          height: 100%;
          color: var(--text-primary);
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .header-brand .logo-text {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .header-brand .logo-text span { color: rgba(255,255,255,0.4); }
        .header-brand .logo-tagline { color: var(--text-muted); font-size: 14px; }
        
        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .settings-trigger {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .settings-trigger:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: #fff;
          transform: translateY(-2px);
        }
        .settings-trigger.active {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
        }
        .settings-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
          border: 2px solid #000;
        }

        /* Settings Modal Styles */
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .settings-modal {
          width: 100%;
          max-width: 500px;
          background: rgba(15,15,15,0.9);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }
        .settings-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .settings-header .title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .settings-header .title-icon { color: #fff; }
        .settings-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
        .close-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }
        
        .settings-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .settings-section label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 12px;
        }
        .status-grid { display: flex; gap: 12px; }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .status-pill.active { color: #fff; }
        .pulse { width: 8px; height: 8px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff; }

        .field-desc { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 12px; }
        
        .auth-input-group {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
        }
        .auth-input-group:focus-within {
          border-color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .auth-input-group input {
          flex: 1;
          background: none;
          border: none;
          padding: 14px 0;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
        }
        .auth-input-group .input-icon { color: rgba(255,255,255,0.3); }

        .settings-footer {
          padding: 24px;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: flex-end;
        }
        .save-btn {
          background: #fff;
          color: #000;
          border: none;
          padding: 12px 32px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255,255,255,0.1);
        }

        .module-navbar {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow-x: auto;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .nav-item.active {
          color: #fff;
        }
        .active-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #fff;
          border-radius: 99px;
          box-shadow: 0 0 15px rgba(255,255,255,0.5);
        }
        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
        }

        .workspace-area {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .workspace-card.glassy {
          background: rgba(10,10,10,0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 450px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .empty-workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          gap: 16px;
          text-align: center;
          padding: 40px;
        }
        .empty-workspace h3 { color: #fff; }

        .action-form {
          padding: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .form-header {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
        }
        .form-header .icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .form-header h2 { font-size: 24px; margin-bottom: 4px; }
        .form-header p { color: var(--text-muted); }

        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .input-group label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .input-group input, .input-group select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }
        .input-group input:focus {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.08);
        }

        .button-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .execute-btn {
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .execute-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,255,255,0.2);
        }
        .execute-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .script-btn {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .script-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .script-btn:active { transform: scale(0.99); }

        .terminal-section {
          background: #000;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .terminal-header {
          padding: 10px 16px;
          background: #111;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #222;
        }
        .terminal-header .dots { display: flex; gap: 6px; }
        .terminal-header .dots span { width: 8px; height: 8px; border-radius: 50%; background: #333; }
        .terminal-header .title { font-family: monospace; font-size: 11px; color: #666; }
        
        .terminal-body {
          padding: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          max-height: 250px;
          overflow-y: auto;
          background: #000;
        }
        .log-line { margin-bottom: 4px; display: flex; gap: 8px; }
        .log-line.system { color: #fff; }
        .log-line.info { color: #aaa; }
        .log-line.success { color: #fff; }
        .log-line.error { color: #ff6666; }
        .log-line .timestamp { color: #444; }
        .log-line .type { font-weight: bold; min-width: 60px; }

        .results-card {
          margin-top: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 24px;
        }
        .results-container-styled {
          padding: 2px;
          overflow-y: auto;
          max-height: 600px;
        }
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .result-item.glassy {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .result-item.glassy:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .user-result {
          display: flex;
          gap: 16px;
        }
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-name { font-weight: 700; color: #fff; margin-right: 8px; font-size: 15px; }
        .user-handle { color: var(--text-muted); font-size: 14px; }
        .user-bio { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px; line-height: 1.5; }

        .tweet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .author-handle { font-weight: 700; color: #fff; font-size: 15px; }
        .tweet-date { color: var(--text-muted); font-size: 13px; margin-left: 8px; }
        .tweet-text { 
          font-size: 15px; 
          color: #fff; 
          line-height: 1.6; 
          white-space: pre-wrap;
          word-break: break-word;
        }
        .tweet-link { color: var(--text-muted); transition: color 0.2s; }
        .tweet-link:hover { color: #fff; }
        .tweet-media { margin-top: 12px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .media-player { width: 100%; display: block; }
        .tweet-media.images { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .tweet-media.images img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }

        .profile-result { padding: 0 !important; }
        .profile-banner { height: 100px; background: linear-gradient(90deg, #333, #666); }
        .profile-header { padding: 0 20px; margin-top: -30px; display: flex; align-items: flex-end; gap: 16px; }
        .profile-avatar { 
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          border: 4px solid #000; 
          background: #222;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-info h2 { font-size: 20px; color: #fff; margin: 0; }
        .handle { color: rgba(255,255,255,0.5); margin: 0; font-size: 14px; font-weight: 500; margin-bottom: 2px; }
        .profile-result .bio { padding: 16px 20px; font-size: 15px; color: rgba(255,255,255,0.9); }
        .profile-stats { padding: 0 20px 20px; display: flex; gap: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
        .stat { font-size: 14px; color: var(--text-muted); }
        .stat strong { color: #fff; margin-right: 4px; }

        .media-result {
          padding: 24px !important;
        }
        .media-title {
          font-size: 18px;
          margin-bottom: 20px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .video-player-container {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .premium-player {
          width: 100%;
          max-height: 500px;
          display: block;
        }
        .image-grid-large {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .image-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 1;
        }
        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .overlay-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          color: #fff;
          backdrop-filter: blur(4px);
        }
        .media-actions {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: center;
        }
        .download-btn {
          background: #fff;
          color: #000;
          padding: 10px 24px;
          border-radius: 99px;
          font-weight: 700;
          text-decoration: none;
          font-size: 14px;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .export-buttons {
          display: flex;
          gap: 10px;
        }
        .results-preview {
          background: #000;
          padding: 16px;
          border-radius: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #10b981;
          overflow: auto;
          border: 1px solid rgba(16, 185, 129, 0.2);
          max-height: 400px;
        }
        .download-results {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
