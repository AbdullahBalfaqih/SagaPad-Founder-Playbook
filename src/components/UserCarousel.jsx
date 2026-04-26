"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, ChevronLeft, ChevronRight, User, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function UserCarousel({ users }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Reset references
    const items = cardsRef.current.filter(Boolean);
    if (items.length === 0) return;

    const spacing = 0.1;
    const snap = gsap.utils.snap(spacing);
    const seamlessLoop = buildSeamlessLoop(items, spacing);
    
    let iteration = 0;
    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true
    });

    /* 
    const trigger = ScrollTrigger.create({
      start: 0,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
        } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
          wrapBackward(self);
        } else {
          scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
          scrub.invalidate().restart();
          self.wrapping = false;
        }
      },
      end: "+=3000",
    });
    */

    function wrapForward() {
      iteration++;
      // No manual scroll needed as we disabled ScrollTrigger
    }

    function wrapBackward() {
      iteration--;
      if (iteration < 0) {
        iteration = 9;
        seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
        scrub.pause();
      }
    }

    function scrubTo(totalTime) {
      scrub.vars.totalTime = snap(totalTime);
      scrub.invalidate().restart();
    }

    const nextBtn = containerRef.current.querySelector(".next");
    const prevBtn = containerRef.current.querySelector(".prev");
    const pickBtn = containerRef.current.querySelector(".pick-btn");

    const onNext = () => scrubTo(scrub.vars.totalTime + spacing);
    const onPrev = () => scrubTo(scrub.vars.totalTime - spacing);
    
    const onPick = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      // Animation sequence for picking
      gsap.to(scrub.vars, {
        totalTime: (iteration * seamlessLoop.duration()) + (randomIndex * spacing),
        duration: 2,
        ease: "power4.out",
        onUpdate: () => {
          scrub.vars.totalTime = snap(scrub.vars.totalTime);
          scrub.invalidate().restart();
        }
      });
    };

    nextBtn.addEventListener("click", onNext);
    prevBtn.addEventListener("click", onPrev);
    if (pickBtn) pickBtn.addEventListener("click", onPick);

    return () => {
      // trigger.kill();
      seamlessLoop.kill();
      nextBtn.removeEventListener("click", onNext);
      prevBtn.removeEventListener("click", onPrev);
      if (pickBtn) pickBtn.removeEventListener("click", onPick);
    };
  }, [users]);

  function buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil(1 / spacing),
      startTime = items.length * spacing + 0.5,
      loopTime = (items.length + overlap) * spacing + 1,
      rawSequence = gsap.timeline({ paused: true }),
      seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        }
      }),
      l = items.length + overlap * 2,
      time = 0,
      i, index, item;

    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      rawSequence.fromTo(item, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }, time)
        .fromTo(item, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, time);
      i <= items.length && seamlessLoop.add("label" + i, time);
    }

    rawSequence.time(startTime);
    seamlessLoop.to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none"
    }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
      immediateRender: false,
      ease: "none"
    });
    return seamlessLoop;
  }

  return (
    <div className="gallery-container" ref={containerRef}>
      <div className="gallery">
        <ul className="cards">
          {users.map((user, i) => (
            <li key={i} ref={(el) => (cardsRef.current[i] = el)} className="card-item glassy">
              <div className="card-content">
                <div className="card-avatar">
                   {user.avatar ? <img src={user.avatar} alt="" /> : <User size={48} />}
                </div>
                <div className="card-info">
                  <h4 className="card-name">{user.name || user.username}</h4>
                  <p className="card-handle">@{user.username}</p>
                </div>
                <div className="card-actions">
                  <a 
                    href={`https://x.com/${user.username}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="visit-btn"
                  >
                    <ExternalLink size={14} /> Visit
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="gallery-actions">
          <button className="prev"><ChevronLeft size={18} /></button>
          <button className="pick-btn glassy">
            <Zap size={16} /> Pick One
          </button>
          <button className="next"><ChevronRight size={18} /></button>
        </div>
      </div>

      <style jsx>{`
        .gallery-container {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          margin-top: 20px;
        }
        .gallery {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .cards {
          position: absolute;
          width: 16rem;
          height: 22rem;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
          margin: 0;
        }
        .cards li {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 16rem;
          height: 22rem;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 1.2rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px;
          text-align: center;
          width: 100%;
        }
        .card-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .card-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-handle {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }
        .visit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #fff;
          color: #000;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .visit-btn:hover {
          transform: scale(1.05);
          background: #fff;
          color: #000;
        }
        .gallery-actions {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
        }
        .gallery-actions button {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gallery-actions button:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
          color: #fff;
        }
        .gallery-actions button.pick-btn {
          width: auto;
          padding: 0 32px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 700;
          background: #fff;
          border: none;
          color: #000;
          gap: 10px;
        }
        .gallery-actions button.pick-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
