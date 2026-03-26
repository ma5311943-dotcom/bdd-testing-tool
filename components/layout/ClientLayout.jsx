"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserProvider } from "@/components/layout/UserContext";

export default function ClientLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <UserProvider>
      <div className="app-container">
        <Navbar scrolled={scrolled} />
        <main className="main-section">{children}</main>
        <Footer />
      </div>
    </UserProvider>
  );
}
