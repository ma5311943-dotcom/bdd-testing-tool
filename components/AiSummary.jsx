import React from "react";
import "./AiSummary.css";
import { Sparkles } from "lucide-react";

const AiSummary = ({ summary }) => {
  const { text, score } = summary;

  const parseSections = (text) => {
    const sections = {};
    let currentSection = null;

    text.split("\n").forEach((line) => {
      if (line.startsWith("##")) {
        currentSection = line.replace(/#/g, "").trim();
        sections[currentSection] = [];
      } else if (currentSection && line.trim()) {
        sections[currentSection].push(line);
      }
    });

    return sections;
  };

  const sections = parseSections(text);

  return (
    <div className="ai-summary-wrapper">
      <div className="ai-summary-header">
        <h3><Sparkles size={20} className="glow-icon" /> Intelligence Report</h3>
        <div className="ai-score">SCORE: {score}/100</div>
      </div>

      <div className="ai-cards-container">
        {Object.entries(sections).map(([title, content], idx) => (
          <div key={idx} className="ai-card">
            <h4 className="card-title">{title}</h4>
            <div className="card-content">
              {content.map((line, i) => {
                const cleanLine = line.replace(/#/g, "").trim();
                if (line.startsWith("###")) {
                  return (
                    <strong key={i} className="card-subtitle">
                      {cleanLine}
                    </strong>
                  );
                }
                if (line.startsWith("-")) {
                  return (
                    <p key={i} className="card-item">
                      {line.replace("-", "").trim()}
                    </p>
                  );
                }
                return (
                  <p key={i} className="card-text">
                    {cleanLine}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiSummary;
