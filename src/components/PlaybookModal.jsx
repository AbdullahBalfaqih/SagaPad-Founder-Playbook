"use client";
import { useState, useEffect, useRef } from "react";
import { X, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PlaybookModal({ type, data, onClose }) {
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("playbook-output-content");
      if (!element) return;
      
      const opt = {
        margin:       0,
        filename:     `SagaPad-${type}-playbook.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, backgroundColor: '#0f0f11' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function generate() {
      setLoading(true);
      setError(null);
      try {
        const apiKey = localStorage.getItem("openRouterApiKey");
        
        if (!apiKey) {
          setError("No OpenRouter API Key found. Please add it in Settings.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, data, apiKey })
        });

        const json = await res.json();

        if (json.error) {
          setError(json.error);
        } else {
          setOutput(json.content);
          
          // Extract posts for Content Studio
          const posts = [];
          const postMatches = json.content.match(/(?:\*\*?Post \d+:?\*\*?|Post \d+:)\s*([\s\S]*?)(?=(?:\n\*\*?Post \d+:?\*\*?|\nPost \d+:|$))/gi);
          
          if (postMatches) {
            postMatches.forEach((m, i) => {
               const text = m.replace(/(?:\*\*?Post \d+:?\*\*?|Post \d+:)\s*/i, '').replace(/`/g, '').trim();
               if(text) posts.push({ 
                 num: `Post ${i+1}`, 
                 text, 
                 likes: Math.floor(Math.random()*100 + 10), 
                 retweets: Math.floor(Math.random()*50 + 5), 
                 views: Math.floor(Math.random()*1000 + 100), 
                 bookmarks: Math.floor(Math.random()*20 + 2) 
               });
            });
            if (posts.length > 0) {
              localStorage.setItem('generatedPosts', JSON.stringify(posts));
              window.dispatchEvent(new Event('postsGenerated'));
            }
          }
        }
      } catch (err) {
        setError(err.message || "Failed to connect to AI service.");
      }
      setLoading(false);
    }
    
    generate();
  }, [type, data]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            {type === "project" ? "Project Social Playbook" : "Founder Brand Playbook"}
          </h2>
          {!loading && !error && output && (
            <button 
              onClick={handleDownloadPDF} 
              className="generate-btn"
              style={{ padding: "8px 16px", fontSize: 14, width: "auto", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}
            >
              <Download size={16} /> Save as PDF
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="loading-dots"><span /><span /><span /></div>
            <p style={{ marginTop: 16, color: "var(--text-secondary)", fontSize: 14 }}>
              Generating your personalized AI playbook...
            </p>
          </div>
        ) : error ? (
          <div style={{ padding: 20, color: "#ff4d4d", background: "rgba(255, 77, 77, 0.1)", borderRadius: 8 }}>
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div id="playbook-output-content" className="playbook-output markdown-body" style={{ fontSize: 14, lineHeight: 1.6, padding: "40px", backgroundColor: "#0f0f11", color: "#ffffff" }}>
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
