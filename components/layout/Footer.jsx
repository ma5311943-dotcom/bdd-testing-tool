"use client";

import { useRouter, usePathname } from "next/navigation";
import "./Footer.css";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h4 className="logo">
              <span>Bdd</span> Testify Scenarios
            </h4>
            <p>
              The standard in AI-driven web analysis. Providing deep insights
              into performance, security, and behavioral compliance.
            </p>
            <div className="social-links">
              {/* Social icons would go here */}
            </div>
          </div>

          <div className="footer-col">
            <h5>Platform</h5>
            <ul>
              <li>
                <button className="nav-link" onClick={() => router.push("/")}>
                  Home
                </button>
              </li>
              <li>
                <button
                  className="nav-link"
                  onClick={() => {
                    if (!isHomePage) {
                      router.push("/");
                      setTimeout(() => {
                        document
                          .getElementById("pricing")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    } else {
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  className="nav-link"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="nav-link"
                  onClick={() => router.push("/test-senerio")}
                >
                  Studio
                </button>
              </li>
              <li>
                <button
                  className="nav-link"
                  onClick={() => router.push("/manual-testing")}
                >
                  Manual
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">API Reference</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <p style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
              Questions? Reach out to our team.
            </p>
            <p style={{ fontWeight: 600, marginTop: "0.5rem" }}>
              support@webtester.ai
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Bdd Testify Scenarios. All rights reserved.</p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <a
              style={{ textDecoration: "none", color: "var(--text-dim)" }}
              href="#"
            >
              Privacy Policy
            </a>
            <a
              style={{ textDecoration: "none", color: "var(--text-dim)" }}
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

