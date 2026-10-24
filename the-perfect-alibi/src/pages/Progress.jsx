import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {LayoutDashboard,Search,Users,Network,Clock3,Brain,ArrowLeft,ClipboardList,Trophy,History,CheckCircle2,Circle,} from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { getHistory } from "../services/storageService.js";
import sidebarImage from "./sidebar.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import backdropImage from "./backdrop.jpg";
export default function Progress() {
  const { cases = [], progress = {} } = useGame();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    setHistory(getHistory() || []);
  }, []);
  const completed = cases.filter(
    (c) => progress[c.id]?.completed
  ).length;
  const totalScore = cases.reduce(
    (sum, c) =>
      sum +
      (progress[c.id]?.completed
        ? Number(progress[c.id]?.score || 0)
        : 0),
    0
  );

  const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Investigation", path: "/investigation", icon: Search },
    { label: "Suspects", path: "/suspects", icon: Users },
    { label: "Evidence Board", path: "/evidence", icon: Network },
    { label: "Timeline", path: "/timeline", icon: Clock3 },
    { label: "Final Deduction", path: "/deduction", icon: Brain },
  ];

  return (
    <div className="progress-page">
      <style>{styles}</style>
      <aside className="progress-sidebar">
        <div className="progress-brand">
          <img
            src={magnifierImage}
            alt="Detective magnifying glass"
            className="progress-brand-image"
          />

          <div className="progress-brand-copy">
            <h1>The Deduction Matrix</h1>
            <p>PRIVATE INVESTIGATION DIVISION</p>
          </div>
        </div>

        <p className="progress-nav-heading">INVESTIGATION DESK</p>

        <nav className="progress-navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `progress-nav-link ${
                  isActive ? "progress-nav-active" : ""
                }`
              }
            >
              <Icon size={18} strokeWidth={1.6} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="progress-sidebar-bottom">
          <Link to="/dashboard" className="progress-back-link">
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>
        </div>
      </aside>
      <main className="progress-main">
        <div className="progress-content">
          <header className="progress-header">
            <p className="progress-eyebrow">DETECTIVE RECORD</p>
            <h2>Progress &amp; History</h2>
            <p className="progress-description">
              Every case leaves a record. Review your investigations,
              track your deductions, and revisit your past attempts.
            </p>
          </header>
          <section className="progress-stats">
            <article className="progress-stat-card">
              <div className="progress-stat-top">
                <span className="progress-stat-label">
                  CASES COMPLETED
                </span>
                <CheckCircle2 size={20} />
              </div>

              <p className="progress-stat-value">
                {completed}
                <span>/{cases.length || 3}</span>
              </p>

              <p className="progress-stat-note">
                Investigations completed
              </p>
            </article>

            <article className="progress-stat-card">
              <div className="progress-stat-top">
                <span className="progress-stat-label">
                  SAVED SCORE TOTAL
                </span>
                <Trophy size={20} />
              </div>
              <p className="progress-stat-value">{totalScore}</p>
              <p className="progress-stat-note">
                Points from completed cases
              </p>
            </article>

            <article className="progress-stat-card">
              <div className="progress-stat-top">
                <span className="progress-stat-label">
                  ATTEMPTS RECORDED
                </span>
                <History size={20} />
              </div>

              <p className="progress-stat-value">{history.length}</p>

              <p className="progress-stat-note">
                Submitted deductions
              </p>
            </article>
          </section>

          <section className="progress-section">
            <div className="progress-section-heading">
              <div className="progress-section-icon">
                <ClipboardList size={20} />
              </div>

              <div>
                <h3>Case records</h3>
                <p>Your investigation archive</p>
              </div>
            </div>

            {cases.length === 0 ? (
              <div className="progress-empty">
                <Circle size={25} />
                <p>No cases are available yet.</p>
              </div>
            ) : (
              <div className="progress-case-list">
                {cases.map((c) => {
                  const caseData = progress[c.id] || {};
                  const isCompleted = Boolean(caseData.completed);

                  return (
                    <article className="progress-case-card" key={c.id}>
                      <div className="progress-case-icon">
                        {isCompleted ? (
                          <CheckCircle2 size={21} />
                        ) : (
                          <ClipboardList size={21} />
                        )}
                      </div>

                      <div className="progress-case-info">
                        <h4>{c.title}</h4>

                        <p>
                          {c.difficulty || "Unclassified"}
                          <span className="progress-dot">·</span>
                          {isCompleted
                            ? "Completed"
                            : caseData.stage || "Not started"}
                        </p>
                      </div>

                      <div className="progress-case-result">
                        <span
                          className={
                            isCompleted
                              ? "progress-completed-label"
                              : "progress-pending-label"
                          }
                        >
                          {isCompleted ? "COMPLETED" : "IN PROGRESS"}
                        </span>

                        <strong>
                          {isCompleted
                            ? `${caseData.score || 0}/100`
                            : "—"}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
          <section className="progress-section progress-history-section">
            <div className="progress-section-heading">
              <div className="progress-section-icon">
                <History size={20} />
              </div>

              <div>
                <h3>Attempt history</h3>
                <p>A record of your submitted deductions</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="progress-empty">
                <History size={28} />
                <h4>No attempts recorded</h4>
                <p>
                  Your submitted case attempts will appear here once
                  you complete a final deduction.
                </p>

                <Link
                  to="/dashboard"
                  className="progress-primary-button"
                >
                  Explore investigations
                </Link>
              </div>
            ) : (
              <div className="progress-history-list">
                {[...history]
                  .reverse()
                  .map((h, index) => (
                    <article
                      className="progress-history-card"
                      key={h.attemptId || `${h.caseId}-${h.completedAt}-${index}`}
                    >
                      <div className="progress-history-icon">
                        {h.correct ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <History size={20} />
                        )}
                      </div>

                      <div className="progress-history-info">
                        <h4>{h.caseTitle || "Untitled case"}</h4>

                        <p>
                          {h.completedAt
                            ? new Date(h.completedAt).toLocaleString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="progress-history-result">
                        <strong>{h.score ?? 0}/100</strong>

                        <span
                          className={
                            h.correct
                              ? "progress-result-correct"
                              : "progress-result-incorrect"
                          }
                        >
                          {h.correct ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </section>

          <footer className="progress-footer">
            <span>❧</span>
            Every mystery leaves a trace. Every alibi hides a truth.
            <span>❧</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .progress-page {
    display: flex;
    min-height: 100vh;
    color: #f5eddc;
    background:url("${backdropImage}") center / cover fixed;
    font-family: Georgia, "Times New Roman", serif;
  }
  .progress-sidebar {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 256px;
    height: 100vh;
    min-height: 100vh;
    overflow-y: auto;
    z-index: 5;
    border-right: 1px solid rgba(215, 183, 120, 0.2);
    background: url("${sidebarImage}") center / cover;
  }

  .progress-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 108px;
    padding: 18px 13px;
    border-bottom: 1px solid rgba(215, 183, 120, 0.19);
  }

  .progress-brand-image {
    width: 57px;
    height: 65px;
    flex-shrink: 0;
    object-fit: cover;
    object-position: center;
    mix-blend-mode: screen;
    filter: sepia(0.25) brightness(0.88);
  }

  .progress-brand-copy {
    min-width: 0;
  }

  .progress-brand h1 {
    margin: 0;
    color: #ead5a9;
    font-size: 19px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .progress-brand p {
    margin: 7px 0 0;
    color: rgba(224, 201, 157, 0.55);
    font-family: Arial, sans-serif;
    font-size: 8px;
    letter-spacing: 1.35px;
    line-height: 1.5;
  }

  .progress-nav-heading {
    margin: 0;
    padding: 29px 20px 12px;
    color: rgba(222, 197, 150, 0.46);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .progress-navigation {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 11px;
  }

  .progress-nav-link {
    display: flex;
    align-items: center;
    gap: 13px;
    min-height: 45px;
    padding: 0 13px;
    border: 1px solid transparent;
    color: rgba(244, 232, 210, 0.65);
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 12px;
    letter-spacing: 0.2px;
    transition: background 180ms ease, color 180ms ease;
  }

  .progress-nav-link:hover {
    color: #f5e6c6;
    background: rgba(215, 183, 120, 0.07);
  }

  .progress-nav-active {
    color: #e5c88f;
    border-color: rgba(215, 183, 120, 0.2);
    background: rgba(215, 183, 120, 0.1);
  }

  .progress-nav-active svg {
    color: #d7b778;
  }

  .progress-sidebar-bottom {
    margin-top: auto;
    padding: 20px 19px 24px;
    border-top: 1px solid rgba(215, 183, 120, 0.17);
  }

  .progress-sidebar-label {
    color: #d7b778;
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
  }

  .progress-sidebar-bottom > p {
    margin: 8px 0 19px;
    color: rgba(242, 229, 204, 0.5);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 1px;
    line-height: 1.5;
  }

  .progress-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(242, 229, 204, 0.7);
    font-family: Arial, sans-serif;
    font-size: 11px;
    text-decoration: none;
  }

  .progress-back-link:hover {
    color: #e8cc96;
  }
  .progress-main {
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    padding: 48px 45px 32px;
    background: linear-gradient(
      110deg,
      rgba(19, 14, 10, 0.4),
      rgba(14, 11, 9, 0.17)
    );
  }

  .progress-content {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  .progress-header {
    padding-bottom: 27px;
    border-bottom: 1px solid rgba(215, 183, 120, 0.2);
  }

  .progress-eyebrow {
    margin: 0;
    color: rgba(220, 190, 135, 0.72);
    font-family: Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
  }

  .progress-header h2 {
    margin: 12px 0 0;
    color: #f5eddc;
    font-size: clamp(32px, 4vw, 43px);
    font-weight: 400;
    letter-spacing: -1px;
  }

  .progress-description {
    max-width: 620px;
    margin: 12px 0 0;
    color: rgba(241, 230, 209, 0.62);
    font-size: 14px;
    line-height: 1.8;
  }
  .progress-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 15px;
    margin-top: 27px;
  }

  .progress-stat-card {
    min-width: 0;
    padding: 21px 20px;
    border: 1px solid rgba(215, 183, 120, 0.22);
    background: linear-gradient(
      135deg,
      rgba(39, 28, 19, 0.78),
      rgba(17, 13, 10, 0.76)
    );
  }

  .progress-stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: #c6a56b;
  }

  .progress-stat-label {
    color: rgba(241, 230, 209, 0.52);
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 1.4px;
    line-height: 1.6;
  }

  .progress-stat-value {
    margin: 18px 0 0;
    color: #ead2a1;
    font-size: 42px;
    line-height: 1;
  }

  .progress-stat-value span {
    margin-left: 4px;
    color: rgba(245, 237, 220, 0.4);
    font-size: 21px;
  }

  .progress-stat-note {
    margin: 12px 0 0;
    color: rgba(241, 230, 209, 0.4);
    font-family: Arial, sans-serif;
    font-size: 10px;
  }
  .progress-section {
    margin-top: 37px;
  }

  .progress-section-heading {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 17px;
  }

  .progress-section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    color: #d7b778;
    border: 1px solid rgba(215, 183, 120, 0.27);
    background: rgba(24, 17, 11, 0.7);
  }

  .progress-section-heading h3 {
    margin: 0;
    color: #f0e1c3;
    font-size: 25px;
    font-weight: 400;
  }

  .progress-section-heading p {
    margin: 5px 0 0;
    color: rgba(241, 230, 209, 0.43);
    font-family: Arial, sans-serif;
    font-size: 10px;
  }
  .progress-case-list,
  .progress-history-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .progress-case-card {
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 0;
    padding: 17px 19px;
    border: 1px solid rgba(245, 237, 220, 0.11);
    background: rgba(13, 10, 8, 0.53);
    transition:
      border-color 180ms ease,
      background 180ms ease;
  }

  .progress-case-card:hover,
  .progress-history-card:hover {
    border-color: rgba(215, 183, 120, 0.31);
    background: rgba(38, 27, 18, 0.62);
  }

  .progress-case-icon,
  .progress-history-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    color: #c8a66c;
    border: 1px solid rgba(215, 183, 120, 0.18);
    background: rgba(215, 183, 120, 0.05);
  }

  .progress-case-info,
  .progress-history-info {
    flex: 1;
    min-width: 0;
  }

  .progress-case-info h4,
  .progress-history-info h4 {
    margin: 0;
    color: #f0e1c3;
    font-size: 17px;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .progress-case-info p,
  .progress-history-info p {
    margin: 7px 0 0;
    color: rgba(241, 230, 209, 0.45);
    font-family: Arial, sans-serif;
    font-size: 10px;
    line-height: 1.6;
  }

  .progress-dot {
    padding: 0 7px;
    color: #c6a56b;
  }

  .progress-case-result,
  .progress-history-result {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 7px;
    flex-shrink: 0;
  }

  .progress-case-result strong,
  .progress-history-result strong {
    color: #e6ce9d;
    font-size: 20px;
    font-weight: 400;
  }

  .progress-completed-label,
  .progress-pending-label,
  .progress-result-correct,
  .progress-result-incorrect {
    font-family: Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 1px;
  }

  .progress-completed-label,
  .progress-result-correct {
    color: #d6c08f;
  }

  .progress-pending-label,
  .progress-result-incorrect {
    color: rgba(241, 230, 209, 0.4);
  }

  .progress-history-section {
    margin-top: 39px;
  }

  .progress-history-card {
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 0;
    padding: 17px 19px;
    border: 1px solid rgba(245, 237, 220, 0.11);
    background: rgba(13, 10, 8, 0.53);
    transition:
      border-color 180ms ease,
      background 180ms ease;
  }

  .progress-history-result strong {
    font-size: 18px;
  }

  .progress-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 20px;
    border: 1px dashed rgba(215, 183, 120, 0.23);
    color: rgba(241, 230, 209, 0.5);
    background: rgba(13, 10, 8, 0.38);
    text-align: center;
  }

  .progress-empty > svg {
    margin-bottom: 12px;
    color: rgba(215, 183, 120, 0.68);
  }

  .progress-empty h4 {
    margin: 0;
    color: #eadcc0;
    font-size: 19px;
    font-weight: 400;
  }

  .progress-empty p {
    margin: 8px 0 0;
    font-family: Arial, sans-serif;
    font-size: 12px;
    line-height: 1.7;
  }

  .progress-primary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    margin-top: 19px;
    padding: 0 17px;
    border: 1px solid #d7b778;
    color: #1b140d;
    background: #d7b778;
    font-family: Arial, sans-serif;
    font-size: 11px;
    text-decoration: none;
    transition: background 180ms ease;
  }

  .progress-primary-button:hover {
    background: #ead4a5;
  }

  .progress-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 44px;
    color: rgba(222, 197, 150, 0.47);
    font-size: 12px;
    font-style: italic;
    text-align: center;
  }

  .progress-footer span {
    color: #b9975f;
  }
  @media (max-width: 1000px) {
    .progress-main {
      padding: 35px 25px;
    }

    .progress-stats {
      gap: 10px;
    }

    .progress-stat-card {
      padding: 17px 14px;
    }

    .progress-stat-label {
      font-size: 8px;
      letter-spacing: 1px;
    }
  }
/* Mobile responsive navbar — matches Timeline / Evidence Board */
@media (max-width: 650px) {
  .progress-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  .progress-sidebar {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;

    display: flex;
    flex: 0 0 auto;
    flex-direction: column;

    width: 100%;
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

  .progress-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 0;
    padding: 16px;
    border-bottom: none;
    overflow: visible;
  }

  .progress-brand-image {
    flex: 0 0 38px;
    width: 38px;
    height: 42px;
    margin-right: 0;
  }

  .progress-brand-copy {
    min-width: 0;
  }

  .progress-brand h1 {
    font-size: 17px;
  }

  .progress-brand p {
    margin-top: 6px;
    font-size: 8px;
  }

  .progress-nav-heading,
  .progress-sidebar-bottom {
    display: none;
  }

  /* Horizontal scrolling navigation */
  .progress-navigation {
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

  .progress-navigation::-webkit-scrollbar {
    display: none;
  }

  .progress-nav-link {
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

  .progress-nav-link:hover {
    color: #fff0d0;
    background: rgba(107, 75, 43, 0.5);
  }

  .progress-nav-active {
    border-color: #d7b778;
    color: #21150b;
    background: #d7b778;
  }

  .progress-nav-active svg {
    color: #21150b;
  }

  .progress-nav-link svg {
    flex: 0 0 15px;
    width: 15px;
    height: 15px;
  }

  /* Main content below the navbar */
  .progress-main {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    margin-left: 0;
    padding: 30px 18px 44px;
    background-attachment: scroll;
  }

  .progress-content {
    width: 100%;
  }

  .progress-header h2 {
    font-size: 34px;
  }

  .progress-description {
    font-size: 13px;
  }

  .progress-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .progress-stat-card {
    padding: 19px;
  }

  .progress-stat-value {
    margin-top: 12px;
    font-size: 37px;
  }

  .progress-section-heading h3 {
    font-size: 23px;
  }
}

@media (max-width: 420px) {
  .progress-brand {
    padding: 14px 12px;
    gap: 8px;
  }

  .progress-brand-image {
    flex-basis: 38px;
    width: 38px;
    height: 42px;
  }

  .progress-brand h1 {
    font-size: 16px;
  }

  .progress-brand p {
    font-size: 7px;
    letter-spacing: 0.8px;
  }

  .progress-navigation {
    padding-right: 12px;
    padding-left: 12px;
  }

  .progress-main {
    padding: 26px 14px 36px;
  }

  .progress-header h2 {
    font-size: 30px;
  }

  .progress-case-card,
  .progress-history-card {
    align-items: flex-start;
    gap: 10px;
    padding: 14px 11px;
  }

  .progress-case-icon,
  .progress-history-icon {
    width: 33px;
    height: 33px;
  }

  .progress-case-info h4,
  .progress-history-info h4 {
    font-size: 14px;
  }

  .progress-case-result strong,
  .progress-history-result strong {
    font-size: 15px;
  }

  .progress-case-result,
  .progress-history-result {
    max-width: 95px;
    text-align: right;
  }

  .progress-completed-label,
  .progress-pending-label,
  .progress-result-correct,
  .progress-result-incorrect {
    font-size: 8px;
    letter-spacing: 0.4px;
  }
}
`;
