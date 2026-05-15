"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/nextjs";
import {
  Search,
  Zap,
  Layout,
  MessageSquare,
  Activity,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";
import gsap from "gsap";

export default function Navbar({ scrolled }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/", icon: <Search size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <Layout size={18} /> },
    { name: "Studio", path: "/test-senerio", icon: <Zap size={18} /> },
    { name: "Manual", path: "/manual-testing", icon: <Activity size={18} /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare size={18} /> },
  ];

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
      if (mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => router.push("/")}>
        <div
          className="logo-icon"
          style={{
            width: "32px",
            height: "32px",
            background: "var(--grad-primary)",
            borderRadius: "8px",
          }}
        ></div>
        <span>Bdd</span> Testify Scenarios
      </div>

      {/* Desktop Links */}
      <div className="nav-links desktop-only">
        {navLinks.map((link) => (
          <button
            key={link.name}
            className={`nav-link ${pathname === link.path ? "active" : ""}`}
            onClick={() => handleNavClick(link.path)}
          >
            {link.name}
          </button>
        ))}
      </div>

      <div className="nav-actions">
        {authLoaded && userLoaded ? (
          isSignedIn ? (
            <>
              <div className="desktop-only" style={{ marginRight: "1rem" }}>
                <button
                  className="chat-nav-link"
                  onClick={() => router.push("/chat")}
                >
                  <MessageSquare size={18} />
                  <span>Support</span>
                </button>
              </div>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-primary">Get Started</button>
            </SignInButton>
          )
        ) : (
          <div className="spinner-mini"></div>
        )}

        <button
          className="hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="mobile-menu" ref={mobileMenuRef}>
          {isSignedIn && (
            <>
              <div className="mobile-user-profile">
                <img
                  src={user?.imageUrl}
                  alt=""
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <div className="user-details">
                  <span className="user-name">{user?.firstName}</span>
                  <span className="user-email">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
              <div className="menu-divider"></div>
            </>
          )}

          {navLinks.map((link) => (
            <button
              key={link.name}
              className={pathname === link.path ? "active" : ""}
              onClick={() => handleNavClick(link.path)}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {link.icon}
              {link.name}
            </button>
          ))}

          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="btn-primary" style={{ marginTop: "1rem" }}>
                Login / Register
              </button>
            </SignInButton>
          )}
        </div>
      </>
    )}
  </nav>
  );
}
