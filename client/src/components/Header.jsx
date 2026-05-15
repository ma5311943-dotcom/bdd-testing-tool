import "./Header.css";
import { ShieldCheck } from "lucide-react";
import { SignedIn } from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="report-header">
      <div className="brand-section">
        <ShieldCheck size={38} className="brand-icon" />
        <div className="brand-text">
          <h1>Bdd Testify Scenarios</h1>
          <span>Behavioral Analysis Engine v4.0</span>
        </div>
      </div>

      <SignedIn>
        <div className="account-section">
          {/* User profile is handled by the main navbar, but keeping this for spacing/consistency if needed */}
        </div>
      </SignedIn>
    </header>
  );
};

export default Header;
