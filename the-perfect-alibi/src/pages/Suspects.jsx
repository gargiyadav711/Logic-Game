import { Link, NavLink } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import SuspectCard from "../components/SuspectCard.jsx";
import SidebarImage from "./sidebar.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import backdropImage from "./backdrop.jpg";
import { LayoutDashboard, Search, Users, Network, Clock3, Brain, } from "lucide-react";
const NAVIGATION = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigation", path: "/investigation", icon: Search },
  { label: "Suspects", path: "/suspects", icon: Users },
  { label: "Evidence", path: "/evidence", icon: Network },
  { label: "Timeline", path: "/timeline", icon: Clock3 },
  { label: "Final Deduction", path: "/deduction", icon: Brain },
];
export default function Suspects() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
  } = useGame();

  if (!c) {
    return (
      <div className="suspects-page">
        <aside className="suspects-sidebar" style={{ backgroundImage: `url("${SidebarImage}")` }}>
          <div className="suspects-sidebar-overlay" />
          <div className="suspects-sidebar-content">
            <Link to="/dashboard" className="suspects-brand">
              <img src={magnifierImage} alt="" />
              <div>
                <h2>The Deduction Matrix</h2>
                <p>PRIVATE INVESTIGATION DIVISION</p>
              </div>
            </Link>
            <nav className="suspects-navigation">
              {NAVIGATION.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `suspects-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="suspects-main">
          <div className="suspects-empty">
            <h2>No active case</h2>
            <p>Select an investigation before reviewing suspects.</p>
            <Link to="/dashboard" className="suspects-action-link">
              Open a case →
            </Link>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="suspects-page">
      <aside className="suspects-sidebar" style={{ backgroundImage: `url("${SidebarImage}")` }}>
        <div className="suspects-sidebar-content">
          <Link to="/dashboard" className="suspects-brand">
            <img src={magnifierImage} alt="" />
            <div>
              <h2>The Deduction Matrix</h2>
              <p>PRIVATE INVESTIGATION DIVISION</p>
            </div>
          </Link>
          <div className="suspects-sidebar-divider" />
          <p className="suspects-nav-heading">INVESTIGATION MENU</p>
          <nav className="suspects-navigation">
            {NAVIGATION.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `suspects-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={1.7} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="suspects-sidebar-footer">
            <span className="suspects-status-dot" />
            CASE FILE ACCESS ACTIVE
          </div>
        </div>
      </aside>
      <main className="suspects-main" style={{ "--suspects-backdrop": `url("${backdropImage}")`, }}>
        <div className="suspects-container">
          <header className="suspects-header">
            <p className="suspects-eyebrow">PERSONS OF INTEREST</p>
            <h1 className="suspects-title">Suspects</h1>
          </header>
          <section className="suspects-section">
            <div className="suspects-section-heading">
              <span className="suspects-count">
                {c.suspects.length}{" "}
                {c.suspects.length === 1 ? "SUSPECT" : "SUSPECTS"}
              </span>
            </div>
            <div className="suspects-grid">
              {c.suspects.map((s, index) => (
                <SuspectCard
                  key={s.id}
                  suspect={s}
                  index={index}
                  selected={caseProgress.selectedSuspectId === s.id}
                  onSelect={(id) =>
                    updateCaseProgress({
                      selectedSuspectId: id,
                      stage: "suspects",
                    })
                  }
                />
              ))}
            </div>
          </section>
          <footer className="suspects-footer">
            <p>
              <span className="suspects-footer-mark">✦</span>
              Every alibi deserves scrutiny.
            </p>
            <Link to="/evidence" className="suspects-action-link">
              Review Evidence <span>→</span>
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}