import { Link, NavLink } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import SidebarImage from "./sidebar.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import backdropImage from "./backdrop.jpg";
import { LayoutDashboard, Search, Users, Network, Clock3, Brain, } from "lucide-react";
const NAVIGATION = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigation", path: "/investigation", icon: Search },
  { label: "Suspects", path: "/suspects", icon: Users },
  { label: "Evidence Board", path: "/evidence", icon: Network },
  { label: "Timeline", path: "/timeline", icon: Clock3 },
  { label: "Final Deduction", path: "/deduction", icon: Brain },
];

export default function Investigation() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
  } = useGame();
  if (!c) {
    return (
      <div className="case-not-found">
        <p>
          Case not found.{" "}
          <Link to="/dashboard">Return to archive</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="investigation-page">
      <aside
        className="investigation-sidebar"
        style={{ backgroundImage: `url(${SidebarImage})`, }}>
        <div className="sidebar-gradient" />
        <div className="sidebar-content">
          <div className="sidebar-brand">
            <img src={magnifierImage} alt="Detective magnifying glass" className="sidebar-magnifier" />
            <span className="sidebar-brand-title">
              The Deduction Matrix
            </span>
          </div>
          <nav className="sidebar-navigation">
            {NAVIGATION.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `sidebar-nav-link${isActive ? " active" : ""}`}>
                <Icon className="sidebar-nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="investigation-main" style={{ "--investigation-backdrop": `url("${backdropImage}")` }}>
        <div className="investigation-container">
          <header className="investigation-header">
            <p className="investigation-case-label">
              CASE {c.id} · {c.difficulty.toUpperCase()}
            </p>
            <h1 className="investigation-title">
              {c.title}
            </h1>
            <p className="investigation-subtitle">
              INVESTIGATION
            </p>
          </header>
          <div className="investigation-grid">
            <article className="case-briefing">
              <h2 className="case-section-title">Case Briefing</h2>
              <div className="case-title-divider" />
              <p className="case-description">{c.briefing}</p>
              <h3 className="case-scenario-title">
                Scenario
              </h3>
              <p className="case-description case-scenario-description">
                {c.scenario}
              </p>
            </article>
            <aside className="case-detail">
              <h2 className="case-section-title">Case Details</h2>
              <div className="case-title-divider" />
              <p className="case-detail-label"> VICTIM</p>
              <p className="case-victim-name">{c.victim}</p>
              <hr className="case-detail-divider" />
              <p className="case-detail-label">CRITICAL WINDOW</p>
              <p className="case-detail-value">{c.crimeTime}</p>
              <hr className="case-detail-divider" />
              <label className="briefing-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(caseProgress?.briefingReviewed)}
                  onChange={(e) =>
                    updateCaseProgress({
                      briefingReviewed: e.target.checked,
                      stage: "investigation",
                    })
                  }
                  className="briefing-checkbox"
                />
                <span>I have reviewed the briefing</span>
              </label>

              <Link to="/suspects"
                onClick={() =>
                  updateCaseProgress({
                    stage: "investigation",
                  })
                }
                className="examine-suspects-link"
              >
                Examine Suspects <span>→</span>
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
