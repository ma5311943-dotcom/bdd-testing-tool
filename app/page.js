"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import LandingPage from "@/components/LandingPage";
import UrlInput from "@/components/UrlInput";
import Dashboard from "@/components/Dashboard";
import { useUserContext } from "@/components/layout/UserContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { role, normalTokens, specialTokens, fetchUserTokens } = useUserContext();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const urlSectionRef = useRef(null);
  const auditCardRef = useRef(null);

  // GSAP for Audit Card
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (auditCardRef.current) {
        gsap.fromTo(
          auditCardRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: auditCardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [results]);

  const handleTestRun = async (url) => {
    if (role !== "admin" && (normalTokens === null || normalTokens <= 0)) {
      setError(
        "Insufficient tokens. Please upgrade your plan to continue searching."
      );
      setTimeout(() => {
        document
          .getElementById("pricing")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const email =
        clerkUser?.primaryEmailAddress?.emailAddress ||
        clerkUser?.emailAddresses?.[0]?.emailAddress;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Test failed");
      }

      setResults(data);

      if (clerkUser) {
        fetchUserTokens();
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email, url, result: data }),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTesting = () => {
    urlSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!authLoaded || !userLoaded) {
    return (
      <div className="container">
        <div className="loading-state" style={{ marginTop: "4rem" }}>
          <div className="loader-orbit">
            <div className="loader-inner"></div>
          </div>
          <p>Initializing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {isSignedIn ? (
        results ? (
          <Dashboard data={results} />
        ) : (
          <>
            <LandingPage onStart={handleStartTesting} />

            <div
              ref={auditCardRef}
              className="audit-hub-card glass"
              style={{
                padding: "2.5rem",
                borderRadius: "24px",
                textAlign: "center",
                marginTop: "4rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="status-chip"
                style={{ margin: "0 auto 1.5rem", fontSize: "0.65rem" }}
              >
                <div className="status-dot"></div> READY FOR ANALYSIS
              </div>

              <h2
                className="hero-title"
                style={{ fontSize: "2.2rem", marginBottom: "1rem" }}
              >
                Analyze Any <span className="gradient-text">Website</span>
              </h2>

              <div
                className="token-display"
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  justifyContent: "center",
                  marginBottom: "2.5rem",
                }}
              >
                <div
                  className="glass-panel"
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    SCAN TOKENS
                  </p>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--primary)",
                    }}
                  >
                    {role === "admin" ? "∞" : normalTokens}
                  </h3>
                </div>
                <div
                  className="glass-panel"
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    PROTOCOL TOKENS
                  </p>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--accent)",
                    }}
                  >
                    {role === "admin" ? "∞" : specialTokens}
                  </h3>
                </div>
              </div>

              <p
                style={{
                  maxWidth: "550px",
                  margin: "0 auto 2.5rem",
                  color: "var(--text-dim)",
                  fontSize: "0.95rem",
                }}
              >
                Enter a URL below to perform a comprehensive audit across
                security, performance, and accessibility vectors.
              </p>

              <div
                ref={urlSectionRef}
                className="input-container"
                style={{ maxWidth: "650px", margin: "0 auto" }}
              >
                <UrlInput onRunTest={handleTestRun} isLoading={loading} />
              </div>

              {error && (
                <div
                  className="error-msg"
                  style={{
                    marginTop: "1.5rem",
                    color: "var(--error)",
                    fontSize: "0.85rem",
                  }}
                >
                  {error}
                </div>
              )}

              {loading && (
                <div className="loading-state" style={{ marginTop: "2.5rem" }}>
                  <div
                    className="loader-orbit"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <div className="loader-inner"></div>
                  </div>
                  <p
                    className="gradient-text"
                    style={{
                      fontWeight: 700,
                      marginTop: "0.75rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    Deploying Engine...
                  </p>
                </div>
              )}
            </div>
          </>
        )
      ) : (
        <LandingPage onStart={handleStartTesting} />
      )}
    </div>
  );
}
