import { Link, NavLink } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import EvidenceCard from "../components/EvidenceCard.jsx";
import { LayoutDashboard, Search, Users, Network, Clock3, Brain, ArrowLeft, } from "lucide-react";
import sidebarImage from "./sidebar.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import backdropImage from "./backdrop.jpg";
const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigation", path: "/investigation", icon: Search },
  { label: "Suspects", path: "/suspects", icon: Users },
  { label: "Evidence Board", path: "/evidence", icon: Network },
  { label: "Timeline", path: "/timeline", icon: Clock3 },
  { label: "Final Deduction", path: "/deduction", icon: Brain },
];

export default function EvidenceBoard() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
  } = useGame();
  if (!c) {
    return (
      <p className="evidence-no-case">
        No active case. <Link to="/dashboard">Open a case</Link>.
      </p>
    );
  }
  const selected = caseProgress.collectedEvidenceIds || [];
  const toggle = (id, checked) => {
    const next = checked ? [...new Set([...selected, id])] : selected.filter((x) => x !== id);
    updateCaseProgress({
      collectedEvidenceIds: next,
      selectedEvidenceIds: next,
      stage: "evidence",
    });
  };

  return (
    <div className="evidence-page">
      <aside className="evidence-sidebar"
        style={{ "--evidence-sidebar-image": `url("${sidebarImage}")`, }}>
        <div className="evidence-sidebar-content">
          <Link to="/dashboard" className="evidence-brand">
            <img src={magnifierImage} alt="" className="evidence-brand-icon" />
            <div>
              <h1>The Deduction Matrix</h1>
              <p>PRIVATE INVESTIGATION DIVISION</p>
            </div>
          </Link>
          <div className="evidence-sidebar-divider" />
          <p className="evidence-nav-heading">INVESTIGATION MENU</p>
          <nav className="evidence-navigation">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `evidence-nav-link ${isActive ? "evidence-nav-link-active" : ""
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.6} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="evidence-sidebar-bottom">
            <Link to="/dashboard" className="evidence-back-link">
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>
          </div>
        </div>
      </aside>
      <main className="evidence-main" style={{ "--evidence-sidebar-image": `url("${backdropImage}")`, }}>
        <div className="evidence-content">
          <header className="evidence-page-header">
            <p className="evidence-eyebrow">FORENSIC RECORD</p>
            <h2 className="evidence-title">Evidence Board</h2>
            <p className="evidence-description">
              Select the evidence you believe is relevant. Selected evidence
              is saved automatically.
            </p>
            <div className="evidence-case-meta">
              <span>CASE FILE</span>
              <span>{c.title || "ACTIVE INVESTIGATION"}</span>
              <span className="evidence-selected-count">
                {selected.length} ITEM{selected.length === 1 ? "" : "S"} SELECTED
              </span>
            </div>
          </header>
          <div className="evidence-cards">
            {(c.evidence || []).map((e) => (
              <EvidenceCard
                key={e.id}
                evidence={e}
                checked={selected.includes(e.id)}
                onChange={toggle}
              />
            ))}
          </div>
          <div className="evidence-actions">
            <Link to="/timeline" className="evidence-action-link">
              Reconstruct timeline <span>→</span>
            </Link>
            <Link to="/interrogation" className="evidence-action-link evidence-action-secondary">
              Challenge statements <span>→</span>
            </Link>
          </div>
          <footer className="evidence-footer">
            <span>THE DEDUCTION MATRIX</span>
          </footer>
        </div>
      </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        
.evidence-page,
.evidence-page *,
.evidence-page *::before,
.evidence-page *::after {
  box-sizing: border-box;
}

.evidence-page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  color: #f5eddc;
  background: #17120e;
  font-family: 'DM Sans', sans-serif;
}

.evidence-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100vh;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #19120d;
  background-image: var(--evidence-sidebar-image);
  background-position: center;
  background-size: cover;
  border-right: 1px solid rgba(215, 183, 120, 0.2);
  z-index: 1000;
}

.evidence-sidebar-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 16px;
}

.evidence-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: #f5eddc;
  text-decoration: none;
}

.evidence-brand-icon {
  flex: 0 0 46px;
  width: 46px;
  height: 52px;
  object-fit: contain;
}

.evidence-brand h1 {
  margin: 0;
  font-family: 'Bodoni Moda', serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.25;
}

.evidence-brand p {
  margin: 6px 0 0;
  color: #b7a17d;
  font-size: 8px;
  letter-spacing: 1.2px;
  line-height: 1.5;
}

.evidence-sidebar-divider {
  height: 1px;
  margin: 25px 0;
  background: rgba(215, 183, 120, 0.24);
  flex-shrink: 0;
}

.evidence-nav-heading {
  margin: 0 0 12px 8px;
  color: #a78d69;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
}

.evidence-navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.evidence-nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 11px 12px;
  border: 1px solid transparent;
  color: #dfcdb0;
  background: transparent;
  font-size: 12px;
  letter-spacing: 0.25px;
  text-decoration: none;
  transition:
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.evidence-nav-link:hover {
  color: #fff0d0;
  background: rgba(107, 75, 43, 0.5);
}

.evidence-nav-link-active {
  border-color: #d7b778;
  color: #21150b;
  background: #d7b778;
}

.evidence-nav-link-active:hover {
  color: #21150b;
  background: #e2c68e;
}

.evidence-sidebar-bottom {
  margin-top: auto;
  padding: 20px 8px 0;
}

.evidence-case-stamp {
  display: inline-block;
  padding: 6px 9px;
  border: 1px solid rgba(215, 183, 120, 0.45);
  color: #d7b778;
  font-family: 'Bodoni Moda', serif;
  font-size: 10px;
  letter-spacing: 2px;
}

.evidence-sidebar-bottom > p {
  margin: 15px 0 20px;
  color: rgba(245, 237, 220, 0.48);
  font-family: 'Bodoni Moda', serif;
  font-size: 12px;
  font-style: italic;
}

.evidence-back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #bba98e;
  font-size: 11px;
  text-decoration: none;
}

.evidence-back-link:hover {
  color: #f5d7a0;
}

.evidence-main {
  position: relative;
  isolation: isolate;
  flex: 1 1 auto;
  min-width: 0;
  width: calc(100% - 256px);
  min-height: 100vh;
  margin-left: 256px;
  padding: 46px 42px 25px;
  background-color: #211a13;
  background-image: var(--evidence-sidebar-image);
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

.evidence-content {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

.evidence-page-header {
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(196, 162, 112, 0.22);
}

.evidence-eyebrow {
  margin: 0;
  color: rgba(219, 190, 143, 0.7);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
}

.evidence-title {
  margin: 11px 0 0;
  color: #f5eddc;
  font-family: 'Bodoni Moda', serif;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 500;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.evidence-description {
  max-width: 600px;
  margin: 14px 0 0;
  color: rgba(245, 237, 220, 0.65);
  font-size: 13px;
  line-height: 1.8;
}

.evidence-case-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 23px;
  color: #bba98e;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.evidence-case-meta > span:first-child {
  padding: 5px 7px;
  border: 1px solid rgba(194, 157, 99, 0.4);
  color: #d6b47d;
}

.evidence-selected-count {
  margin-left: auto;
  color: #d6b47d;
}

.evidence-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 18px;
  margin-top: 28px;
}

.evidence-cards > * {
  min-width: 0;
}

.evidence-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.evidence-action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 43px;
  padding: 11px 17px;
  border: 1px solid rgba(202, 166, 111, 0.55);
  color: #f0d6a6;
  background: rgba(115, 79, 40, 0.12);
  font-size: 12px;
  text-decoration: none;
  transition:
    background 180ms ease,
    border-color 180ms ease;
}

.evidence-action-link:hover {
  border-color: #d3b27d;
  background: rgba(172, 126, 65, 0.2);
}

.evidence-action-link span {
  font-size: 17px;
}

.evidence-action-secondary {
  border-color: rgba(245, 237, 220, 0.22);
  color: rgba(245, 237, 220, 0.8);
  background: rgba(0, 0, 0, 0.12);
}

.evidence-action-secondary:hover {
  border-color: rgba(245, 237, 220, 0.5);
  background: rgba(255, 255, 255, 0.04);
}

.evidence-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 45px;
  padding-top: 15px;
  border-top: 1px solid rgba(196, 162, 112, 0.16);
  color: rgba(245, 237, 220, 0.35);
  font-size: 8px;
  letter-spacing: 1.6px;
}

.evidence-no-case {
  padding: 30px;
  color: #f5eddc;
  background: #211a13;
  font-family: 'DM Sans', sans-serif;
}

.evidence-no-case a {
  color: #d6b47d;
}

@media (max-width: 1050px) and (min-width: 761px) {
  .evidence-sidebar {
    width: 230px;
  }

  .evidence-main {
    width: calc(100% - 230px);
    margin-left: 230px;
    padding: 35px 26px 25px;
  }

  .evidence-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .evidence-page {
    flex-direction: column;
  }

  .evidence-sidebar {
    position: sticky;
    top: 0;
    left: 0;
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    min-height: 0;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid rgba(215, 183, 120, 0.2);
    z-index: 1000;
  }

  .evidence-sidebar-content {
    padding: 16px;
  }

  .evidence-brand-icon {
    flex-basis: 38px;
    width: 38px;
    height: 42px;
  }

  .evidence-brand h1 {
    font-size: 17px;
  }

  .evidence-sidebar-divider,
  .evidence-nav-heading,
  .evidence-sidebar-bottom {
    display: none;
  }

  .evidence-navigation {
    flex-direction: row;
    gap: 5px;
    margin-top: 14px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .evidence-nav-link {
    flex: 0 0 auto;
    min-height: 38px;
    padding: 9px 10px;
    font-size: 11px;
    white-space: nowrap;
  }

  .evidence-nav-link svg {
    width: 15px;
    height: 15px;
  }

  .evidence-main {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: auto;
    margin-left: 0;
    padding: 30px 18px;
    background-attachment: scroll;
  }

  .evidence-title {
    font-size: 34px;
  }

  .evidence-selected-count {
    margin-left: 0;
  }

  .evidence-cards {
    grid-template-columns: 1fr;
  }

  .evidence-footer {
    margin-top: 32px;
  }
}
@media (max-width: 420px) {
  .evidence-sidebar-content {
    padding: 14px 12px;
  }

  .evidence-brand {
    gap: 8px;
  }

  .evidence-brand h1 {
    font-size: 16px;
  }

  .evidence-brand p {
    font-size: 7px;
    letter-spacing: 0.8px;
  }

  .evidence-main {
    padding: 26px 14px;
  }

  .evidence-title {
    font-size: 30px;
  }

  .evidence-actions {
    flex-direction: column;
  }

  .evidence-action-link {
    width: 100%;
  }

  .evidence-case-meta {
    gap: 9px;
    line-height: 1.6;
  }
}
      `}</style>
    </div>
  );
}