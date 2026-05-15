// ===== Imports =====
import { SignInButton, SignedOut, SignedIn } from "@clerk/clerk-react";
import "./LandingPage.css";
import { Shield, Zap, Search, ChevronRight, Activity, Layout, Database, Terminal } from "lucide-react";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import Pricing from "./Pricing";

const LandingPage = ({ onStart }) => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Intro animations - Simplified for speed
      gsap.from(".hero-content", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
      gsap.from(".matrix-node", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" }); // Removed stagger
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section className="portal-container" ref={container}>
      {/* Decorative Elements */}
      <div className="decorative-orb orb-1"></div>
      <div className="decorative-orb orb-2"></div>

      <div className="portal-main">
        {/* Left Side: Hero */}
        <div className="portal-hero hero-content">
          <div className="status-chip">
            <div className="status-dot"></div>
            Bdd Testify Scenarios Core v4.0 Active
          </div>

          <h1 className="hero-title">
            The Next Generation of <br />
            <span className="gradient-text">Web Auditing</span>
          </h1>

          <p className="hero-description">
            Experience deep-level behavioral analysis and systemic compliance audits.
            Map your web architecture with our proprietary BDD engine.
          </p>

          <div className="hero-actions-container">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary">
                  Get Started <ChevronRight size={20} />
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <button className="btn-primary" onClick={onStart}>
                Launch Audit Studio <Zap size={20} />
              </button>
            </SignedIn>

            <button className="btn-secondary">
              View Documentation
            </button>
          </div>

          <div className="stats-hud glass">
            <div className="stat-item">
              <span className="stat-val">99.8%</span>
              <span className="stat-lbl">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">120ms</span>
              <span className="stat-lbl">Latency</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">24/7</span>
              <span className="stat-lbl">Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right Side: Feature Grid */}
        <div className="portal-features">
          <div className="features-matrix">
            {[
              {
                icon: <Shield size={32} color="var(--primary)" />,
                title: "Security Vectors",
                desc: "Deep-layer vulnerability scanning and SSL integrity validation."
              },
              {
                icon: <Zap size={32} color="var(--secondary)" />,
                title: "Rapid Execution",
                desc: "High-velocity performance audits with headless browser clusters."
              },
              {
                icon: <Terminal size={32} color="var(--accent)" />,
                title: "BDD Testing",
                desc: "Browser-level validation for complex user-behavior scenarios."
              },
              {
                icon: <Database size={32} color="var(--success)" />,
                title: "Deep Analysis",
                desc: "Map metadata and structural patterns with AI-driven insights."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="matrix-node glass"
              >
                <div className="node-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Pricing Section */}
      <Pricing />
    </section>
  );
};

export default LandingPage;

