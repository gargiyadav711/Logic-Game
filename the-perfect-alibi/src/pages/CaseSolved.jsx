import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {LayoutDashboard,Search,Users,Network,Clock3, Brain,ArrowLeft,CheckCircle2,XCircle,Archive,Trophy,} from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import sidebarImage from "./sidebar.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import backdropImage from "./backdrop.jpg";
export default function CaseSolved() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeCase: c, caseProgress } = useGame();
  const result = location.state?.result || caseProgress?.result;
  const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Investigation", path: "/investigation", icon: Search },
    { label: "Suspects", path: "/suspects", icon: Users },
    { label: "Evidence Board", path: "/evidence", icon: Network },
    { label: "Timeline", path: "/timeline", icon: Clock3 },
    { label: "Final Deduction", path: "/deduction", icon: Brain },
  ];

  if (!c || !result) {
    return (
      <div className="solved-page">
        <style>{styles}</style>
        <aside className="solved-sidebar">
          <div className="solved-brand">
            <img src={magnifierImage} alt="Detective magnifying glass"
              className="solved-brand-image"
            />
            <div>
              <h1>The Deduction Matrix</h1>
              <p>PRIVATE INVESTIGATION DIVISION</p>
            </div>
          </div>
          <div className="solved-sidebar-bottom">
            <Link to="/dashboard" className="solved-back-link">
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>
          </div>
        </aside>
        <main className="solved-main">
          <section className="solved-empty">
            <Archive size={42} />
            <p className="solved-eyebrow">INVESTIGATION ARCHIVE</p>
            <h2>No completed result found</h2>
            <p>
              There is no completed case report available. Return to the
              archive to continue your investigation.
            </p>
            <Link to="/dashboard" className="solved-primary-button">
              Return to archive
            </Link>
          </section>
        </main>
      </div>
    );
  }
  const culprit = c.suspects?.find(
    (suspect) => suspect.id === c.correctSuspectId
  );
  const chosen = c.suspects?.find(
    (suspect) => suspect.id === result.selectedSuspectId
  );
  const isCorrect = Boolean(result.correct);
  return (
    <div className="solved-page">
      <style>{styles}</style>
      <aside className="solved-sidebar">
        <div className="solved-brand">
          <img src={magnifierImage} alt="Detective magnifying glass"className="solved-brand-image"/>
          <div className="solved-brand-copy">
            <h1>The Deduction Matrix</h1>
            <p>PRIVATE INVESTIGATION DIVISION</p>
          </div>
        </div>
        <div className="solved-nav-heading">INVESTIGATION DESK</div>
        <nav className="solved-navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `solved-nav-link ${isActive ? "solved-nav-active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.6} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="solved-sidebar-bottom">
          <Link to="/dashboard" className="solved-back-link">
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </aside>
      <main className="solved-main">
        <div className="solved-content">
          <div className="solved-topline">
            <span className="solved-eyebrow">CASE REPORT FILED</span>
            <span className="solved-status">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={15} />
                  CASE RESOLVED
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  CASE REVIEWED
                </>
              )}
            </span>
          </div>

          <div className="solved-heading">
            <div className="solved-heading-icon">
              {isCorrect ? (
                <Trophy size={30} strokeWidth={1.4} />
              ) : (
                <Archive size={30} strokeWidth={1.4} />
              )}
            </div>

            <div>
              <h2>
                {isCorrect ? "Deduction confirmed" : "Case reviewed"}
              </h2>

              <p className="solved-subtitle">
                {isCorrect
                  ? `Your accusation of ${chosen?.name || "the selected suspect"} was correct.`
                  : `Your accusation of ${chosen?.name || "the selected suspect"} was incorrect.`}
              </p>
            </div>
          </div>
          <section className="solved-score-panel">
            <div className="solved-score-header">
              <div>
                <p className="solved-section-label">FINAL SCORE</p>
                <div className="solved-score">
                  {result.score ?? 0}
                  <span>/100</span>
                </div>
              </div>
              <div
                className={`solved-score-seal ${
                  isCorrect ? "solved-seal-correct" : "solved-seal-review"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <XCircle size={32} />
                )}
                <span>{isCorrect ? "SOLVED" : "REVIEWED"}</span>
              </div>
            </div>
            <div className="solved-score-divider" />
            <p className="solved-mode">
              Validation mode: {result.mode || "Local Validation Mode"}
            </p>
            <div className="solved-explanation">
              <p className="solved-section-label">THE DECISIVE EXPLANATION</p>
              <h3>How the mystery was solved</h3>
              <p>
                {c.solutionExplanation ||
                  "No solution explanation is available for this case."}
              </p>
            </div>
            <div className="solved-culprit">
              <span className="solved-culprit-label">CORRECT CULPRIT</span>
              <strong>{culprit?.name || "Not available"}</strong>
            </div>
          </section>

          {result.breakdown && (
            <section className="solved-breakdown">
              <p className="solved-section-label">DEDUCTION BREAKDOWN</p>
              <div className="solved-breakdown-grid">
                {Object.entries(result.breakdown).map(([key, value]) => (
                  <div className="solved-breakdown-card" key={key}>
                    <p>{key.replace(/([A-Z])/g, " $1")}</p>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="solved-actions">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="solved-primary-button"
            >
              <Archive size={16} />
              Return to archive
            </button>

            <Link to="/progress" className="solved-secondary-button">
              View progress
            </Link>
          </div>

          <p className="solved-footer-note">
            <span>❧</span> Every mystery leaves a trace. Every alibi hides a
            truth. <span>❧</span>
          </p>
        </div>
      </main>
    </div>
  );
}
const styles = `
  .solved-page {
    min-height: 100vh;
    display: flex;
    color: #f5eddc;
    background:url("${backdropImage}") center / cover fixed;
    font-family: Georgia, "Times New Roman", serif;
  }

  .solved-sidebar {
    width: 256px;
    min-width: 256px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    border-right: 1px solid rgba(215, 183, 120, 0.2);
    background: url("${sidebarImage}") center / cover;
    z-index: 5;
  }

  .solved-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 108px;
    padding: 18px 13px;
    border-bottom: 1px solid rgba(215, 183, 120, 0.19);
  }

  .solved-brand-image {
    width: 57px;
    height: 65px;
    flex-shrink: 0;
    object-fit: cover;
    object-position: center;
    mix-blend-mode: screen;
    filter: sepia(0.25) brightness(0.88);
  }

  .solved-brand-copy {
    min-width: 0;
  }

  .solved-brand h1 {
    margin: 0;
    color: #ead5a9;
    font-size: 19px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .solved-brand p {
    margin: 7px 0 0;
    color: rgba(224, 201, 157, 0.55);
    font-family: Arial, sans-serif;
    font-size: 8px;
    letter-spacing: 1.35px;
    line-height: 1.5;
  }

  .solved-nav-heading {
    padding: 29px 20px 12px;
    color: rgba(222, 197, 150, 0.46);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .solved-navigation {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 11px;
  }

  .solved-nav-link {
    min-height: 45px;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 0 13px;
    border: 1px solid transparent;
    color: rgba(244, 232, 210, 0.65);
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 12px;
    letter-spacing: 0.2px;
    transition:
      background 180ms ease,
      color 180ms ease,
      border-color 180ms ease;
  }

  .solved-nav-link:hover {
    color: #f5e6c6;
    background: rgba(215, 183, 120, 0.07);
  }

  .solved-nav-active {
    color: #e5c88f;
    border-color: rgba(215, 183, 120, 0.2);
    background: rgba(215, 183, 120, 0.1);
  }

  .solved-nav-active svg {
    color: #d7b778;
  }

  .solved-sidebar-bottom {
    margin-top: auto;
    padding: 20px 19px 24px;
    border-top: 1px solid rgba(215, 183, 120, 0.17);
  }

  .solved-small-label {
    color: #d7b778;
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .solved-sidebar-bottom > p {
    margin: 8px 0 19px;
    color: rgba(242, 229, 204, 0.5);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 1px;
    line-height: 1.5;
  }

  .solved-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(242, 229, 204, 0.7);
    font-family: Arial, sans-serif;
    font-size: 11px;
    text-decoration: none;
  }

  .solved-back-link:hover {
    color: #e8cc96;
  }
  .solved-main {
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    padding: 52px 48px 34px;
    background: linear-gradient(
      110deg,
      rgba(19, 14, 10, 0.42),
      rgba(14, 11, 9, 0.17)
    );
  }

  .solved-content {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
  }

  .solved-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    padding-bottom: 21px;
    border-bottom: 1px solid rgba(215, 183, 120, 0.2);
  }

  .solved-eyebrow,
  .solved-section-label {
    color: rgba(220, 190, 135, 0.72);
    font-family: Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
  }

  .solved-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #d9c49c;
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 1.5px;
  }

  .solved-heading {
    display: flex;
    align-items: center;
    gap: 19px;
    margin: 34px 0 29px;
  }

  .solved-heading-icon {
    width: 65px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #d7b778;
    border: 1px solid rgba(215, 183, 120, 0.36);
    background: rgba(25, 18, 12, 0.6);
  }

  .solved-heading h2 {
    margin: 0;
    color: #f5eddc;
    font-size: clamp(29px, 4vw, 43px);
    font-weight: 400;
    letter-spacing: -1.1px;
    line-height: 1.15;
  }

  .solved-subtitle {
    margin: 10px 0 0;
    color: rgba(241, 230, 209, 0.69);
    font-size: 15px;
    line-height: 1.6;
  }
  .solved-score-panel {
    padding: 29px 31px 27px;
    border: 1px solid rgba(215, 183, 120, 0.27);
    background: linear-gradient(
      135deg,
      rgba(39, 28, 19, 0.87),
      rgba(17, 13, 10, 0.87)
    );
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.15);
  }

  .solved-score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .solved-score {
    margin-top: 9px;
    color: #ead2a1;
    font-size: 61px;
    line-height: 1;
    letter-spacing: -2px;
  }

  .solved-score > span {
    margin-left: 7px;
    color: rgba(245, 237, 220, 0.39);
    font-size: 21px;
    letter-spacing: 0;
  }

  .solved-score-seal {
    width: 88px;
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid rgba(215, 183, 120, 0.33);
    border-radius: 50%;
    color: #d7b778;
  }

  .solved-score-seal span {
    font-family: Arial, sans-serif;
    font-size: 8px;
    letter-spacing: 1.5px;
  }

  .solved-seal-correct {
    color: #d9c28f;
    border-color: rgba(217, 194, 143, 0.55);
  }

  .solved-seal-review {
    color: #c6a18a;
    border-color: rgba(198, 161, 138, 0.45);
  }

  .solved-score-divider {
    height: 1px;
    margin: 25px 0 15px;
    background: rgba(215, 183, 120, 0.17);
  }

  .solved-mode {
    margin: 0;
    color: rgba(239, 226, 202, 0.43);
    font-family: Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 0.7px;
  }

  .solved-explanation {
    margin-top: 31px;
    padding-top: 25px;
    border-top: 1px solid rgba(215, 183, 120, 0.15);
  }

  .solved-explanation h3 {
    margin: 11px 0 12px;
    color: #f0e1c3;
    font-size: 25px;
    font-weight: 400;
  }

  .solved-explanation > p:last-child {
    margin: 0;
    color: rgba(241, 230, 209, 0.7);
    font-size: 14px;
    line-height: 1.9;
    white-space: pre-line;
  }

  .solved-culprit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
    padding: 17px 19px;
    background: rgba(215, 183, 120, 0.07);
  }

  .solved-culprit-label {
    color: rgba(220, 190, 135, 0.68);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .solved-culprit strong {
    color: #ead2a1;
    font-size: 17px;
    font-weight: 400;
  }
  .solved-breakdown {
    margin-top: 28px;
  }

  .solved-breakdown > .solved-section-label {
    margin: 0 0 14px;
  }

  .solved-breakdown-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .solved-breakdown-card {
    min-width: 0;
    padding: 16px 13px;
    border: 1px solid rgba(245, 237, 220, 0.11);
    background: rgba(12, 9, 7, 0.45);
  }

  .solved-breakdown-card p {
    margin: 0;
    color: rgba(241, 230, 209, 0.5);
    font-family: Arial, sans-serif;
    font-size: 10px;
    line-height: 1.5;
    text-transform: capitalize;
    overflow-wrap: anywhere;
  }

  .solved-breakdown-card strong {
    display: block;
    margin-top: 8px;
    color: #e6ce9d;
    font-size: 23px;
    font-weight: 400;
  }

  .solved-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .solved-primary-button,
  .solved-secondary-button {
    min-height: 45px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 20px;
    font-family: Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 0.5px;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 180ms ease,
      border-color 180ms ease,
      color 180ms ease;
  }

  .solved-primary-button {
    border: 1px solid #d7b778;
    color: #1b140d;
    background: #d7b778;
  }

  .solved-primary-button:hover {
    border-color: #ead4a5;
    background: #ead4a5;
  }

  .solved-secondary-button {
    border: 1px solid rgba(245, 237, 220, 0.23);
    color: rgba(245, 237, 220, 0.8);
    background: rgba(0, 0, 0, 0.12);
  }

  .solved-secondary-button:hover {
    border-color: rgba(215, 183, 120, 0.6);
    color: #ead2a1;
    background: rgba(215, 183, 120, 0.06);
  }

  .solved-footer-note {
    margin: 42px 0 0;
    color: rgba(222, 197, 150, 0.47);
    font-size: 12px;
    font-style: italic;
    text-align: center;
    letter-spacing: 0.3px;
  }

  .solved-footer-note span {
    padding: 0 7px;
    color: #b9975f;
  }

  .solved-empty {
    max-width: 560px;
    margin: 100px auto;
    padding: 42px 30px;
    border: 1px solid rgba(215, 183, 120, 0.24);
    background: rgba(17, 12, 8, 0.75);
    text-align: center;
  }

  .solved-empty > svg {
    margin: 0 auto 20px;
    color: #d7b778;
  }

  .solved-empty h2 {
    margin: 13px 0;
    color: #f5eddc;
    font-size: 31px;
    font-weight: 400;
  }

  .solved-empty > p:not(.solved-eyebrow) {
    margin: 0 auto 25px;
    max-width: 390px;
    color: rgba(241, 230, 209, 0.65);
    font-size: 14px;
    line-height: 1.8;
  }

  @media (max-width: 1050px) {
    .solved-main {
      padding: 38px 28px;
    }

    .solved-breakdown-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  /* Mobile responsive navbar — matches Timeline / Evidence Board */
@media (max-width: 650px) {
  .solved-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  .solved-sidebar {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;

    display: flex;
    flex: 0 0 auto;
    flex-direction: column;

    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 0;
    max-height: none;
    overflow: visible;

    background-color: #19120d;
    background-image: url("${sidebarImage}");
    background-position: center;
    background-size: cover;

    border-right: none;
    border-bottom: 1px solid rgba(215, 183, 120, 0.2);
  }

  .solved-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 0;
    padding: 16px;
    border-bottom: none;
    overflow: visible;
  }

  .solved-brand-image {
    flex: 0 0 38px;
    width: 38px;
    height: 42px;
    margin-right: 0;
  }

  .solved-brand-copy {
    min-width: 0;
  }

  .solved-brand h1 {
    font-size: 17px;
  }

  .solved-brand p {
    margin-top: 6px;
    font-size: 8px;
  }

  .solved-nav-heading,
  .solved-sidebar-bottom {
    display: none;
  }

  /* Horizontal scrolling navigation */
  .solved-navigation {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;

    width: 100%;
    margin-top: 0;
    padding: 0 16px 10px;

    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .solved-navigation::-webkit-scrollbar {
    display: none;
  }

  .solved-nav-link {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 8px;

    min-height: 38px;
    padding: 9px 10px;

    border: 1px solid transparent;
    color: #dfcdb0;
    background: transparent;

    font-size: 11px;
    white-space: nowrap;
  }

  .solved-nav-link:hover {
    color: #fff0d0;
    background: rgba(107, 75, 43, 0.5);
  }

  .solved-nav-active {
    border-color: #d7b778;
    color: #21150b;
    background: #d7b778;
  }

  .solved-nav-active svg {
    color: #21150b;
  }

  /* Main content below the navbar */
  .solved-main {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    padding: 30px 18px 44px;
    background-attachment: scroll;
  }

  .solved-content {
    width: 100%;
  }

  .solved-heading {
    align-items: flex-start;
    gap: 13px;
    margin: 27px 0 22px;
  }

  .solved-heading-icon {
    width: 48px;
    height: 48px;
  }

  .solved-heading-icon svg {
    width: 23px;
    height: 23px;
  }

  .solved-heading h2 {
    font-size: 30px;
  }

  .solved-subtitle {
    font-size: 13px;
  }

  .solved-score-panel {
    padding: 22px 18px;
  }

  .solved-score {
    font-size: 51px;
  }

  .solved-score-seal {
    width: 70px;
    height: 70px;
  }

  .solved-breakdown-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .solved-brand {
    padding: 14px 12px;
    gap: 8px;
  }

  .solved-brand-image {
    flex-basis: 38px;
    width: 38px;
    height: 42px;
  }

  .solved-brand h1 {
    font-size: 16px;
  }

  .solved-brand p {
    font-size: 7px;
    letter-spacing: 0.8px;
  }

  .solved-navigation {
    padding-right: 12px;
    padding-left: 12px;
  }

  .solved-main {
    padding: 26px 14px 36px;
  }

  .solved-topline {
    align-items: flex-start;
    flex-direction: column;
  }

  .solved-heading h2 {
    font-size: 27px;
  }

  .solved-score-header {
    align-items: flex-start;
    gap: 10px;
  }

  .solved-score {
    font-size: 44px;
  }

  .solved-score-seal {
    width: 62px;
    height: 62px;
  }

  .solved-score-seal svg {
    width: 25px;
    height: 25px;
  }

  .solved-breakdown-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .solved-actions {
    flex-direction: column;
  }

  .solved-primary-button,
  .solved-secondary-button {
    width: 100%;
  }
}
`;
