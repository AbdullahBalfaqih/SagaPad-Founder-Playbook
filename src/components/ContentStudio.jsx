"use client";
import { useState, useEffect } from "react";
import { Heart, Repeat2, Eye, Bookmark, Send } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_POSTS = [
  { num: "Post 1", text: "Events deserve more than screenshots and spreadsheets.\n\nWe're building SolanaTicket — the onchain ticketing infra for real-world experiences.", likes: 12, retweets: 45, views: 128, bookmarks: 8 },
  { num: "Post 2", text: "Most tickets are still centralized. We're changing that.\n\nSolanaTicket brings transparency, security, and composability to every event.", likes: 36, retweets: 99, views: 342, bookmarks: 15 },
  { num: "Post 3", text: "From mint to check-in, everything onchain.\n\nNo fake tickets.\nNo shady resales.\nJust real experiences, verified.", likes: 52, retweets: 142, views: 510, bookmarks: 22 },
  { num: "Post 4", text: "Built with love on Solana for the culture, by the culture.\n\nWho's building the future of events with us?", likes: 41, retweets: 111, views: 398, bookmarks: 18 },
  { num: "Post 5", text: "We're just getting started.\n\nFollow along as we build the trust layer for every moment that matters.", likes: 68, retweets: 175, views: 620, bookmarks: 30 },
];

export default function ContentStudio() {
  const [posts, setPosts] = useState(DEFAULT_POSTS);

  useEffect(() => {
    const loadPosts = () => {
      const saved = localStorage.getItem('generatedPosts');
      if (saved) {
        try {
          setPosts(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved posts", e);
        }
      }
    };
    
    loadPosts();
    window.addEventListener('postsGenerated', loadPosts);
    return () => window.removeEventListener('postsGenerated', loadPosts);
  }, []);

  return (
    <section className="content-studio" id="content-studio">
      <div className="studio-header">
        <div className="studio-title">
          <span className="studio-dot" /> Content Studio • Ready to Publish
        </div>
      </div>
      <motion.div 
        className="posts-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {posts.map((post, i) => (
          <motion.div 
            key={i} 
            className="post-card"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.25)" }}
          >
            <div className="post-number">{post.num}</div>
            <div className="post-text">{post.text}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div className="post-metrics" style={{ borderTop: 'none', margin: 0, padding: 0, gap: '6px' }}>
                <span className="metric"><Heart size={12} /> {post.likes}</span>
                <span className="metric"><Repeat2 size={12} /> {post.retweets}</span>
                <span className="metric"><Eye size={12} /> {post.views}</span>
              </div>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', background: 'var(--accent)', color: '#000', padding: '5px 12px', borderRadius: '12px', fontWeight: 'bold', marginLeft: '8px', transform: 'translateX(4px)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Send size={12} /> Post
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
