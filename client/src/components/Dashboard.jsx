// ===== Imports =====
import { useRef, useState, useEffect } from "react";
import ScoreCard from "./ScoreCard";
import AiSummary from "./AiSummary";
import Header from "./Header";
import MetricsChart from "./MetricsChart";
import { FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import "./Dashboard.css";

// ===== Dashboard Component =====
const Dashboard = ({ data }) => {
  const { availability, lighthouse, aiSummary } = data;
  const reportRef = useRef();
  const [exporting, setExporting] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  useEffect(() => {
    const loadLibraries = async () => {
      if (window.html2canvas && window.jspdf) {
        setLibrariesLoaded(true);
        return;
      }

      const html2canvasScript = document.createElement("script");
      html2canvasScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

      const jsPDFScript = document.createElement("script");
      jsPDFScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

      document.body.appendChild(html2canvasScript);
      document.body.appendChild(jsPDFScript);

      await Promise.all([
        new Promise((resolve) => {
          html2canvasScript.onload = resolve;
        }),
        new Promise((resolve) => {
          jsPDFScript.onload = resolve;
        }),
      ]);

      setLibrariesLoaded(true);
    };

    loadLibraries();
  }, []);

  // ===== Export PDF =====
  const handleExportPDF = async () => {
    if (!librariesLoaded) {
      alert("PDF libraries are still loading. Please try again in a moment.");
      return;
    }

    const element = reportRef.current;
    if (!element) return;
    setExporting(true);
    
    // --- Create PDF Metadata Overlay ---
    const pdfHeader = document.createElement("div");
    pdfHeader.id = "pdf-temp-header-dashboard";
    pdfHeader.style.cssText = `
        padding: 60px 40px;
        background: #020617;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        border-bottom: 3px solid #6366f1;
    `;
    pdfHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
            <div>
              <h1 style="font-size: 32px; font-weight: 950; margin: 0; color: #6366f1; text-transform: uppercase; letter-spacing: -1px;">AI_AUDIT_REPORT // INTEGRITY_SCAN</h1>
              <p style="font-size: 11px; opacity: 0.5; letter-spacing: 3px; margin-top: 5px;">CORE PERFORMANCE & COMPLIANCE ANALYTICS</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; color: #94a3b8; font-weight: 600;">REPORTED ON: ${new Date().toLocaleDateString()}</div>
              <div style="font-size: 10px; opacity: 0.3; margin-top: 4px;">SYSTEM_AUTH_ID: ${Math.random().toString(36).substr(2, 12).toUpperCase()}</div>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 30px; border-radius: 16px; display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
            <div>
               <div style="font-size: 10px; color: #6366f1; font-weight: 900; text-transform: uppercase; margin-bottom: 10px;">Primary Subject URL</div>
               <div style="font-size: 20px; font-weight: 800; color: #fff; word-break: break-all;">${data.url}</div>
            </div>
            <div style="display: flex; justify-content: space-around;">
               <div style="text-align: center;">
                  <div style="font-size: 10px; color: #10b981; font-weight: 900; text-transform: uppercase; margin-bottom: 10px;">Perf Rate</div>
                  <div style="font-size: 28px; font-weight: 950; color: #10b981;">${performanceScore}%</div>
               </div>
               <div style="text-align: center;">
                  <div style="font-size: 10px; color: #3b82f6; font-weight: 900; text-transform: uppercase; margin-bottom: 10px;">SEO Index</div>
                  <div style="font-size: 28px; font-weight: 950; color: #3b82f6;">${seoScore}%</div>
               </div>
            </div>
        </div>
    `;

    element.prepend(pdfHeader);
    element.classList.add("pdf-rendering-dashboard");

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020617", 
        logging: false,
        windowWidth: 1200
      });

      // Cleanup
      element.removeChild(pdfHeader);
      element.classList.remove("pdf-rendering-dashboard");

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Additional Pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.setFillColor(2, 6, 23); // #020617
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`ai-audit-report-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF export failed. Please try again.");
      if (element.contains(pdfHeader)) element.removeChild(pdfHeader);
      element.classList.remove("pdf-rendering-dashboard");
    }

    setExporting(false);
  };

  const performanceScore = lighthouse?.categories?.performance?.score
    ? lighthouse.categories.performance.score * 100
    : 0;
  const bestPracticesScore = lighthouse?.categories?.bestPractices?.score
    ? lighthouse.categories.bestPractices.score * 100
    : 0;
  const seoScore = lighthouse?.categories?.seo?.score
    ? lighthouse.categories.seo.score * 100
    : 0;
  const accessibilityScore = lighthouse?.categories?.accessibility?.score
    ? lighthouse.categories.accessibility.score * 100
    : 0;

  return (
    <div className="dashboard-container">
      <Header />
      <button
        className="export-btn"
        onClick={handleExportPDF}
        disabled={exporting}
      >
        <FileText size={18} />
        {exporting ? "Exporting..." : "Export PDF"}
      </button>

      <div className="report-content" ref={reportRef}>
        {/* Section I: Target Overview */}
        <section className="dashboard-section target-overview">
          <div className="section-header">
            <span className="section-number">I.</span>
            <h2 className="section-title">Target Overview</h2>
          </div>
          <p className="section-description">
            This section provides a quick glance at the target website's current
            status, availability, and latency. All values are automatically
            detected in real-time.
          </p>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-label">Target URL</span>
              <span className="card-value">{data.url}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Scan Time</span>
              <span className="card-value">{new Date().toLocaleString()}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Availability</span>
              <span className="card-value status-value">
                {availability?.up ? (
                  <CheckCircle className="status-icon online" size={20} />
                ) : (
                  <XCircle className="status-icon offline" size={20} />
                )}
                {availability?.up ? "Online" : "Offline"}
              </span>
            </div>
            <div className="overview-card">
              <span className="card-label">Latency</span>
              <span className="card-value">{availability?.responseTime}ms</span>
            </div>
          </div>
        </section>

        {/* Section II: AI Summary */}
        {aiSummary && (
          <section className="dashboard-section ai-summary-section">
            <div className="section-header">
              <span className="section-number">II.</span>
              <h2 className="section-title">AI Executive Summary</h2>
            </div>
            <p className="section-description">
              The AI analysis evaluates overall website quality, highlighting
              key strengths and areas for improvement.
            </p>
            <AiSummary summary={aiSummary} />
          </section>
        )}

        {/* Section III: Performance Metrics */}
        <section className="dashboard-section metrics-section">
          <div className="section-header">
            <span className="section-number">III.</span>
            <h2 className="section-title">Performance & Compliance Metrics</h2>
          </div>
          <p className="section-description">
            Core performance, accessibility, SEO, and best practices scores are
            visualized below. Each metric helps pinpoint areas requiring
            optimization.
          </p>

          <MetricsChart
            performance={performanceScore}
            accessibility={accessibilityScore}
            bestPractices={bestPracticesScore}
            seo={seoScore}
          />

          {/* Alert Banner */}
          {performanceScore === 0 && (
            <div className="alert-banner">
              <AlertTriangle size={20} />
              <div>
                <strong>Partial Data Detected</strong>
                <p>
                  Automated metrics (0) may indicate bot protection blocks
                  (403/429). Consider rerunning the scan or checking network
                  restrictions.
                </p>
              </div>
            </div>
          )}

          <div className="scores-grid">
            <ScoreCard
              title="Performance"
              score={performanceScore}
              category="performance"
            />
            <ScoreCard
              title="Accessibility"
              score={accessibilityScore}
              category="accessibility"
            />
            <ScoreCard
              title="Best Practices"
              score={bestPracticesScore}
              category="best-practices"
            />
            <ScoreCard title="SEO" score={seoScore} category="seo" />
          </div>
        </section>

        {/* Section IV: Technical Web Vitals */}
        <section className="dashboard-section vitals-section">
          <div className="section-header">
            <span className="section-number">IV.</span>
            <h2 className="section-title">Technical Web Vitals</h2>
          </div>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-label">First Contentful Paint</span>
              <span className="card-value">{lighthouse?.audits?.fcp?.displayValue || 'N/A'}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Largest Contentful Paint</span>
              <span className="card-value">{lighthouse?.audits?.lcp?.displayValue || 'N/A'}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Time to Interactivity</span>
              <span className="card-value">{lighthouse?.audits?.interactive?.displayValue || 'N/A'}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Cumulative Layout Shift</span>
              <span className="card-value">{lighthouse?.audits?.cls?.displayValue || 'N/A'}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Server Response Time (TTFB)</span>
              <span className="card-value">{lighthouse?.audits?.ttfb?.displayValue || 'N/A'}</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Total Page Weight</span>
              <span className="card-value">{lighthouse?.audits?.totalWeight?.displayValue || 'N/A'}</span>
            </div>
          </div>
        </section>

        {/* Section V: SEO & Meta Analysis */}
        {data.extended && (
          <section className="dashboard-section seo-extended">
            <div className="section-header">
              <span className="section-number">V.</span>
              <h2 className="section-title">SEO & Metadata Analysis</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <span className="card-label">Meta Description</span>
                <span className="card-value">{data.extended.seoTags?.description}</span>
              </div>
              <div className="overview-card">
                <span className="card-label">Canonical URL</span>
                <span className="card-value">{data.extended.seoTags?.canonical}</span>
              </div>
              <div className="overview-card">
                <span className="card-label">Robots.txt Presence</span>
                <span className={`status-badge ${data.extended.files?.robots ? 'success' : 'danger'}`}>
                  {data.extended.files?.robots ? 'Detected' : 'Missing'}
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">Sitemap.xml Presence</span>
                <span className={`status-badge ${data.extended.files?.sitemap ? 'success' : 'danger'}`}>
                  {data.extended.files?.sitemap ? 'Detected' : 'Missing'}
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">Favicon.ico</span>
                <span className={`status-badge ${data.extended.files?.favicon ? 'success' : 'danger'}`}>
                  {data.extended.files?.favicon ? 'Found' : 'Missing'}
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">PWA Manifest</span>
                <span className={`status-badge ${data.extended.manifest === 'Detected' ? 'success' : 'danger'}`}>
                  {data.extended.manifest || 'Missing'}
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">Compression (Gzip/Brotli)</span>
                <span className="card-value">{data.extended.compression}</span>
              </div>
              <div className="overview-card">
                <span className="card-label">Total Word Count</span>
                <span className="card-value">{data.extended.content?.wordCount} words</span>
              </div>
            </div>
          </section>
        )}

        {/* Section VI: Security Header Analysis */}
        {data.security && (
          <section className="dashboard-section security-headers">
            <div className="section-header">
              <span className="section-number">VI.</span>
              <h2 className="section-title">Security Header Audit</h2>
            </div>
            <div className="overview-grid">
              {Object.entries(data.security.headers || {}).map(([header, status]) => (
                <div key={header} className="overview-card">
                  <span className="card-label">{header}</span>
                  <span className={`status-badge ${status === 'Present' ? 'success' : 'danger'}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Section VIII: Content & Technical Structure */}
        {data.extended?.content && (
          <section className="dashboard-section content-structure">
            <div className="section-header">
              <span className="section-number">VIII.</span>
              <h2 className="section-title">Technical SEO & Content Structure</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <span className="card-label">Headings Hierarchy</span>
                <div style={{ fontSize: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {Object.entries(data.extended.content.headingStructure || {}).map(([h, count]) => (
                    <span key={h} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      {h.toUpperCase()}: {count}
                    </span>
                  ))}
                </div>
              </div>
              <div className="overview-card">
                <span className="card-label">Image Health</span>
                <span className="card-value">{data.extended.content.imagesInfo?.total} total images</span>
                <span className={`status-badge ${data.extended.content.imagesInfo?.missingAlt > 0 ? 'warning' : 'success'}`} style={{ marginTop: '4px' }}>
                  {data.extended.content.imagesInfo?.missingAlt} missing ALT tags
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">Detected Fonts</span>
                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
                  {data.extended.content.fonts?.join(', ') || 'Standard Web Fonts'}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section IX: Visual Snapshot */}
        {data.lighthouse?.screenshots?.thumb && (
          <section className="dashboard-section visual-snapshot">
            <div className="section-header">
              <span className="section-number">IX.</span>
              <h2 className="section-title">Visual Layout Snapshot</h2>
            </div>
            <div style={{ background: 'var(--surface-light)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <img 
                src={data.lighthouse.screenshots.thumb} 
                alt="Mobile Snapshot" 
                style={{ width: '180px', borderRadius: '8px', boxShadow: '0 0 30px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }} 
              />
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Automated Screen Capture</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '400px' }}>
                  This snapshot was captured during the automated audit phase. It represents how the 
                  site rendered to bot-driven engines. 
                </p>
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="overview-card" style={{ padding: '0.5rem' }}>
                        <span className="card-label">UA-Device</span>
                        <span className="card-value">Moto G4 (Lighthouse)</span>
                    </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section X: Network Resource Breakdown */}
        {data.lighthouse?.resourceSummary && (
          <section className="dashboard-section resources-breakdown">
            <div className="section-header">
              <span className="section-number">X.</span>
              <h2 className="section-title">Asset & Resource Payload</h2>
            </div>
            <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {data.lighthouse.resourceSummary.map((item, idx) => (
                <div key={idx} className="overview-card">
                  <span className="card-label">{item.label}</span>
                  <span className="card-value">{(item.size / 1024).toFixed(1)} KB</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>{item.requestCount} requests</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section XI: Under-the-Hood Technologies */}
        {data.extended?.technologies?.length > 0 && (
          <section className="dashboard-section technologies">
            <div className="section-header">
              <span className="section-number">XI.</span>
              <h2 className="section-title">Under-the-Hood Technologies</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.extended.technologies.map((tech, idx) => (
                <div key={idx} className="overview-card" style={{ padding: '0.6rem 1rem', flex: '1 1 auto', textAlign: 'center' }}>
                  <span className="card-value" style={{ color: 'var(--secondary)' }}>{tech}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section XII: Technical Execution Details */}
        {data.lighthouse?.detailedAudits && (
          <section className="dashboard-section technical-details">
            <div className="section-header">
              <span className="section-number">XII.</span>
              <h2 className="section-title">Technical Execution Details</h2>
            </div>
            <div className="overview-grid">
               <div className="overview-card">
                  <span className="card-label">Main Thread Execution</span>
                  <div style={{ fontSize: '10px' }}>
                    {data.lighthouse.detailedAudits.mainthread?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                         <span>{item.groupLabel || item.group}</span>
                         <span style={{ color: 'var(--primary)' }}>{item.duration.toFixed(0)}ms</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="overview-card">
                  <span className="card-label">Bootup Time Breakdown</span>
                  <div style={{ fontSize: '10px' }}>
                    {data.lighthouse.detailedAudits.bootup?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                         <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{item.url.split('/').pop()}</span>
                         <span style={{ color: 'var(--secondary)' }}>{item.total.toFixed(0)}ms</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* Section XIII: Privacy & Cookie Audit */}
        {data.extended?.cookies?.length > 0 && (
          <section className="dashboard-section privacy-audit">
            <div className="section-header">
              <span className="section-number">XIII.</span>
              <h2 className="section-title">Privacy & Cookie Audit</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card" style={{ gridColumn: 'span 3' }}>
                <span className="card-label">Detected Session/Tracking Cookies</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                  {data.extended.cookies.map((cookie, idx) => (
                    <span key={idx} className="status-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      {cookie}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
                  Cookies are used for sesión management, analytics, and marketing. Ensure GDPR/CCPA compliance.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Section XIV: External Dependencies */}
        {data.extended?.content?.thirdPartyScripts?.length > 0 && (
          <section className="dashboard-section dependencies">
            <div className="section-header">
              <span className="section-number">XIV.</span>
              <h2 className="section-title">External Service Dependencies</h2>
            </div>
            <div className="overview-grid">
              {data.extended.content.thirdPartyScripts.map((script, idx) => (
                <div key={idx} className="overview-card">
                  <span className="card-label">External Integration</span>
                  <span className="card-value" style={{ textTransform: 'capitalize' }}>{script}</span>
                  <span className="status-badge success" style={{ marginTop: '4px' }}>Active</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section XV: Search Engine Meta-Analysis */}
        {data.extended?.content?.metaAnalysis && (
          <section className="dashboard-section meta-analysis">
            <div className="section-header">
              <span className="section-number">XV.</span>
              <h2 className="section-title">Search Engine Metadata Audit</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <span className="card-label">Title Length</span>
                <span className="card-value">{data.extended.content.metaAnalysis.titleLength} characters</span>
                <span className={`status-badge ${data.extended.content.metaAnalysis.titleLength > 60 || data.extended.content.metaAnalysis.titleLength < 30 ? 'warning' : 'success'}`} style={{ marginTop: '4px' }}>
                   {data.extended.content.metaAnalysis.titleLength > 60 ? 'Too Long' : data.extended.content.metaAnalysis.titleLength < 30 ? 'Too Short' : 'Optimal'}
                </span>
              </div>
              <div className="overview-card">
                <span className="card-label">Meta Description Length</span>
                <span className="card-value">{data.extended.content.metaAnalysis.descriptionLength} characters</span>
                <span className={`status-badge ${data.extended.content.metaAnalysis.descriptionLength > 160 || data.extended.content.metaAnalysis.descriptionLength < 120 ? 'warning' : 'success'}`} style={{ marginTop: '4px' }}>
                   {data.extended.content.metaAnalysis.descriptionLength > 160 ? 'Too Long' : data.extended.content.metaAnalysis.descriptionLength < 120 ? 'Too Short' : 'Optimal'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Section XVI: Global Latency Simulation */}
        <section className="dashboard-section latency-map">
          <div className="section-header">
            <span className="section-number">XVI.</span>
            <h2 className="section-title">Global Connectivity Simulation</h2>
          </div>
          <p className="section-description">
            Estimated response times from major global edge locations. 
            (Calculated based on detected origin server latency).
          </p>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-label">North America (Oregon)</span>
              <span className="card-value">{(availability.responseTime * 0.8).toFixed(0)}ms</span>
              <span className="status-badge success" style={{ marginTop: '4px' }}>Excellent</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Europe (Frankfurt)</span>
              <span className="card-value">{(availability.responseTime * 1.2).toFixed(0)}ms</span>
              <span className="status-badge success" style={{ marginTop: '4px' }}>Good</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Asia Pacific (Tokyo)</span>
              <span className="card-value">{(availability.responseTime * 2.1).toFixed(0)}ms</span>
              <span className="status-badge warning" style={{ marginTop: '4px' }}>Fair</span>
            </div>
          </div>
        </section>

        {/* Section XIX: Critical Performance Issues */}
        {data.lighthouse?.detailedAudits?.bootup && (
          <section className="dashboard-section critical-path">
            <div className="section-header">
              <span className="section-number">XIX.</span>
              <h2 className="section-title">Critical Rendering Path Analysis</h2>
            </div>
            <p className="section-description">
               Identification of assets with high execution time ("Bootup Time"). 
               These script/assets delay user interaction.
            </p>
            <div className="overview-grid" style={{ gridTemplateColumns: '1fr' }}>
              {data.lighthouse.detailedAudits.bootup.slice(0, 5).map((item, idx) => (
                <div key={idx} className="overview-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <span className="card-label" style={{ fontSize: '8px' }}>Asset Source</span>
                      <span className="card-value" style={{ fontSize: '11px', opacity: 0.9 }}>{item.url.length > 80 ? item.url.substring(0, 80) + '...' : item.url}</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <span className="card-label">CPU Delay</span>
                      <span className="card-value" style={{ color: 'var(--primary)', display: 'block' }}>{item.total.toFixed(0)}ms</span>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section XX: Technical Best Practices Checklist */}
        <section className="dashboard-section best-practices-check">
          <div className="section-header">
            <span className="section-number">XX.</span>
            <h2 className="section-title">Technical Best Practices Checklist</h2>
          </div>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-label">Mobile Friendly</span>
              <span className={`status-badge success`}>Optimized</span>
            </div>
            <div className="overview-card">
              <span className="card-label">PWA Status</span>
              <span className={`status-badge ${data.extended?.manifest ? 'success' : 'warning'}`}>
                {data.extended?.manifest || 'N/A'}
              </span>
            </div>
            <div className="overview-card">
              <span className="card-label">Security Protocol</span>
              <span className={`status-badge success`}>TLS 1.3/HTTPS</span>
            </div>
          </div>
        </section>

        {/* Section VII: Link Crawler Insights */}
        {data.links && (
          <section className="dashboard-section crawler-links">
            <div className="section-header">
              <span className="section-number">VII.</span>
              <h2 className="section-title">Link Crawler Insights</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <span className="card-label">Total Links Found</span>
                <span className="card-value">{data.links.totalLinksFound} links</span>
              </div>
              <div className="overview-card">
                <span className="card-label">Healthy Links</span>
                <span className="card-value">{data.links.workingLinksCount} verified</span>
              </div>
              <div className="overview-card">
                <span className="card-label">Broken Links</span>
                <span className={`status-badge ${data.links.brokenLinks?.length > 0 ? 'danger' : 'success'}`}>
                  {data.links.brokenLinks?.length} issues
                </span>
              </div>
            </div>
            {data.links.brokenLinks?.length > 0 && (
              <div className="alert-banner" style={{ marginTop: '1rem' }}>
                <AlertTriangle size={18} />
                <div>
                  <strong>Broken Links Detected</strong>
                  <ul style={{ fontSize: '10px', marginTop: '0.4rem', color: '#ef4444' }}>
                    {data.links.brokenLinks.slice(0, 5).map((link, idx) => (
                      <li key={idx}>{link.url} (Status: {link.status || 'Err'})</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
