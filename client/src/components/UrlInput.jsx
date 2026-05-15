import { useState } from "react";
import "./UrlInput.css";

import { Globe, Command } from "lucide-react";

const UrlInput = ({ onRunTest, isLoading }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url && !isLoading) onRunTest(url);
  };

  return (
    <div className="cockpit-input-node">
      <form onSubmit={handleSubmit} className="cockpit-form">
        <div className="input-icon-hub">
           <Globe size={20} className={isLoading ? "spin-slow" : ""} />
        </div>
        <input
          type="text"
          placeholder="TARGET_URL(e.g. google.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <div className="input-command-hint">
          <Command size={14} /> K
        </div>
        <button
          type="submit"
          disabled={isLoading || !url}
          className="cockpit-trigger"
        >
          {isLoading ? (
            <div className="pulse-loader"></div>
          ) : (
            <>DEPLOY ENGINE</>
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlInput;
