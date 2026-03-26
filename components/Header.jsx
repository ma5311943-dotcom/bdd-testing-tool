import "./Header.css";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const Header = () => {
  const { isSignedIn } = useAuth();
  return (
    <header className="report-header">
      <div className="brand-section">
        <ShieldCheck size={38} className="brand-icon" />
        <div className="brand-text">
          <h1>TestifyAI</h1>
          <span>Behavioral Analysis Engine v4.0</span>
        </div>
      </div>

      {isSignedIn && (
        <div className="account-section">
          {/* User profile is handled by the main navbar, but keeping this for spacing/consistency if needed */}
        </div>
      )}
    </header>
  );
};

export default Header;
