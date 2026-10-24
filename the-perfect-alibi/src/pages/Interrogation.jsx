import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import { validateStatementChallenge } from "../services/validationService.js";
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
export default function Interrogation() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
  } = useGame();
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState({});
  if (!c) {
    return (
      <>
        <style>{`
          .interrogation-no-case {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #17110e;
            color: #f5edd2;
            font-family: Arial, sans-serif;
          }

          .interrogation-no-case a {
            margin: 0 5px;
            color: #d7b778;
          }
        `}</style>
        <p className="interrogation-no-case">
          No active case.
          <Link to="/dashboard">Open a case</Link>.
        </p>
      </>
    );
  }
  const evidenceIds = caseProgress.collectedEvidenceIds || [];
  const challenge = async (statement) => {
    if (loading[statement.id]) return;
    setLoading((prev) => ({ ...prev, [statement.id]: true, }));
    try {
      const result = await validateStatementChallenge(
        c,
        statement.id,
        evidenceIds
      );

      setFeedback((prev) => ({
        ...prev,
        [statement.id]: result,
      }));

      if (result.status === "contradicted") {
        updateCaseProgress({
          challengedStatementIds: [
            ...new Set([...(caseProgress.challengedStatementIds || []), statement.id,]),
          ],
          stage: "interrogation",
        });
      }
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        [statement.id]: {
          status: "error",
          feedback:
            error?.message ||
            "Unable to evaluate this statement. Please try again.",
        },
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        [statement.id]: false,
      }));
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .interrogation-app {
          display: flex;
          min-height: 100vh;
          background: #17110e;
          color: #f5edd2;
          font-family: Arial, Helvetica, sans-serif;
        }

        .interrogation-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          width: 256px;
          height: 100vh;
          overflow-y: auto;
          background-image:url("${sidebarImage}");
          background-position: center;
          background-size: cover;
          border-right: 1px solid rgba(215, 183, 120, 0.2);
        }

        .interrogation-brand {
          display: flex;
          align-items: center;
          min-height: 112px;
          padding: 16px 14px;
          overflow: hidden;
          border-bottom: 1px solid rgba(215, 183, 120, 0.2);
        }

        .interrogation-brand-image {
          flex-shrink: 0;
          width: 70px;
          height: 78px;
          margin-right: 8px;
          object-fit: contain;
          object-position: center;
          filter: sepia(0.25) brightness(0.9);
        }

        .interrogation-brand-copy {
          min-width: 0;
        }

        .interrogation-brand-title {
          margin: 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.2;
        }

        .interrogation-brand-subtitle {
          margin: 7px 0 0;
          color: #c6a66c;
          font-size: 8px;
          letter-spacing: 1.5px;
          line-height: 1.6;
        }

        .interrogation-nav-heading {
          margin: 26px 20px 12px;
          color: rgba(245, 237, 210, 0.4);
          font-size: 9px;
          letter-spacing: 2px;
        }

        .interrogation-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 12px;
        }

        .interrogation-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 44px;
          padding: 11px 13px;
          border: 1px solid transparent;
          color: rgba(245, 237, 210, 0.68);
          font-size: 13px;
          text-decoration: none;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .interrogation-nav-link:hover {
          border-color: rgba(215, 183, 120, 0.15);
          background: rgba(215, 183, 120, 0.08);
          color: #f5edd2;
        }

        .interrogation-nav-link.active {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
          font-weight: 600;
        }

        .interrogation-nav-icon {
          flex-shrink: 0;
          width: 17px;
          height: 17px;
        }

        .interrogation-sidebar-footer {
          margin-top: auto;
          padding: 20px 18px;
          border-top: 1px solid rgba(215, 183, 120, 0.2);
        }

        .interrogation-case-label {
          margin: 0 0 8px;
          color: #c6a66c;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .interrogation-case-status {
          margin: 0;
          color: rgba(245, 237, 210, 0.55);
          font-size: 10px;
          line-height: 1.7;
        }

        .interrogation-back-link {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 18px;
          color: #f5edd2;
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .interrogation-back-link:hover {
          color: #d7b778;
        }

        .interrogation-back-icon {
          width: 16px;
          height: 16px;
        }
        .interrogation-main {
          position: relative;
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          margin-left: 256px;
          background-image:url("${backdropImage}");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .interrogation-content {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 52px 48px 64px;
        }

        .interrogation-eyebrow {
          margin: 0;
          color: rgba(215, 183, 120, 0.75);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .interrogation-title {
          margin: 12px 0 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 500;
          line-height: 1.2;
        }

        .interrogation-description {
          max-width: 700px;
          margin: 16px 0 0;
          color: rgba(245, 237, 210, 0.62);
          font-size: 14px;
          line-height: 1.9;
        }

        .interrogation-divider {
          height: 1px;
          margin: 27px 0;
          background: linear-gradient(
            to right,
            rgba(215, 183, 120, 0.55),
            rgba(215, 183, 120, 0.03)
          );
        }
        .interrogation-statements {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .interrogation-statement-card {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.22);
          transition:
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .interrogation-statement-card:hover {
          border-color: rgba(215, 183, 120, 0.38);
          background: rgba(0, 0, 0, 0.3);
        }

        .interrogation-suspect-name {
          margin: 0;
          color: rgba(245, 217, 142, 0.7);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .interrogation-quote {
          margin: 13px 0 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 19px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .interrogation-related-evidence {
          margin: 14px 0 0;
          color: rgba(245, 237, 210, 0.5);
          font-size: 11px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .interrogation-challenge-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 17px;
          padding: 11px 14px;
          border: 1px solid rgba(215, 183, 120, 0.5);
          background: rgba(215, 183, 120, 0.04);
          color: #f5edd2;
          font-size: 11px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .interrogation-challenge-button:hover:not(:disabled) {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
        }

        .interrogation-challenge-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .interrogation-challenge-button:focus-visible,
        .interrogation-final-link:focus-visible {
          outline: 2px solid #d7b778;
          outline-offset: 3px;
        }

        .interrogation-feedback {
          margin: 16px 0 0;
          padding: 12px 14px;
          border-left: 2px solid #d7b778;
          background: rgba(215, 183, 120, 0.08);
          color: #e8d4a5;
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .interrogation-feedback strong {
          display: block;
          margin-bottom: 4px;
          color: #f5edd2;
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .interrogation-feedback-error {
          border-left-color: #d18b78;
          background: rgba(209, 139, 120, 0.08);
          color: #e7b5a6;
        }

        .interrogation-final-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 26px;
          padding: 12px 18px;
          border: 1px solid rgba(215, 183, 120, 0.55);
          background: rgba(0, 0, 0, 0.18);
          color: #f5edd2;
          font-size: 12px;
          text-decoration: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .interrogation-final-link:hover {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
        }

        /* Responsive layout */

        @media (max-width: 900px) {
          .interrogation-sidebar {
            width: 220px;
          }

          .interrogation-main {
            margin-left: 220px;
          }

          .interrogation-content {
            padding: 40px 28px 50px;
          }

          .interrogation-brand-title {
            font-size: 17px;
          }

          .interrogation-brand-image {
            width: 56px;
          }
        }

        /* Mobile responsive navbar — matches Timeline / Evidence Board */
@media (max-width: 650px) {
  .interrogation-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  .interrogation-sidebar {
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

  .interrogation-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 0;
    padding: 16px;
    border-bottom: none;
    overflow: visible;
  }

  .interrogation-brand-image {
    flex: 0 0 38px;
    width: 38px;
    height: 42px;
    margin-right: 0;
  }

  .interrogation-brand-copy {
    min-width: 0;
  }

  .interrogation-brand-title {
    font-size: 17px;
  }

  .interrogation-brand-subtitle {
    margin-top: 6px;
    font-size: 8px;
  }

  .interrogation-nav-heading,
  .interrogation-sidebar-footer {
    display: none;
  }

  /* Horizontal scrolling navigation */
  .interrogation-nav {
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

  .interrogation-nav::-webkit-scrollbar {
    display: none;
  }

  .interrogation-nav-link {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 8px;

    width: auto;
    min-height: 38px;
    padding: 9px 10px;

    border: 1px solid transparent;
    color: #dfcdb0;
    background: transparent;

    font-size: 11px;
    white-space: nowrap;
  }

  .interrogation-nav-link:hover {
    border-color: transparent;
    color: #fff0d0;
    background: rgba(107, 75, 43, 0.5);
  }

  .interrogation-nav-link.active {
    border-color: #d7b778;
    border-bottom-color: #d7b778;
    color: #21150b;
    background: #d7b778;
  }

  .interrogation-nav-icon {
    flex: 0 0 15px;
    width: 15px;
    height: 15px;
  }

  /* Main content below the navbar */
  .interrogation-main {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    margin-left: 0;
    background-attachment: scroll;
  }

  .interrogation-content {
    width: 100%;
    padding: 30px 18px 44px;
  }

  .interrogation-title {
    font-size: 34px;
  }

  .interrogation-description {
    font-size: 13px;
  }

  .interrogation-statement-card {
    padding: 16px;
  }

  .interrogation-quote {
    font-size: 17px;
  }
}

@media (max-width: 420px) {
  .interrogation-brand {
    padding: 14px 12px;
    gap: 8px;
  }

  .interrogation-brand-image {
    flex-basis: 38px;
    width: 38px;
    height: 42px;
  }

  .interrogation-brand-title {
    font-size: 16px;
  }

  .interrogation-brand-subtitle {
    font-size: 7px;
    letter-spacing: 0.8px;
  }

  .interrogation-nav {
    padding-right: 12px;
    padding-left: 12px;
  }

  .interrogation-main {
    padding: 0;
  }

  .interrogation-content {
    padding: 26px 14px 36px;
  }

  .interrogation-title {
    font-size: 30px;
  }
}
        @media (prefers-reduced-motion: reduce) {
          .interrogation-nav-link,
          .interrogation-back-link,
          .interrogation-challenge-button,
          .interrogation-final-link,
          .interrogation-statement-card {
            transition: none;
          }
        }
      `}</style>

      <div className="interrogation-app">
        <aside className="interrogation-sidebar">
          <div className="interrogation-brand">
            <img src={magnifierImage} alt="" className="interrogation-brand-image" />
            <div className="interrogation-brand-copy">
              <h1 className="interrogation-brand-title">
                The Deduction Matrix
              </h1>
              <p className="interrogation-brand-subtitle">
                PRIVATE INVESTIGATION DIVISION
              </p>
            </div>
          </div>
          <p className="interrogation-nav-heading">
            INVESTIGATION
          </p>
          <nav className="interrogation-nav">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `interrogation-nav-link ${isActive ? "active" : ""
                  }`
                }
              >
                <Icon className="interrogation-nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="interrogation-sidebar-footer">
            <Link to="/dashboard" className="interrogation-back-link">
              <ArrowLeft className="interrogation-back-icon" />
              <span>Back to dashboard</span>
            </Link>
          </div>
        </aside>
        <main className="interrogation-main">
          <section className="interrogation-content">
            <p className="interrogation-eyebrow">
              Questioning Room / Case Analysis
            </p>
            <h2 className="interrogation-title">
              Interrogation
            </h2>
            <p className="interrogation-description">
              Select evidence on the Evidence Board first, then challenge
              each suspect's statement using related evidence. Look for
              inconsistencies between what a suspect claims and what the
              evidence establishes.
            </p>
            <div className="interrogation-divider" />
            <div className="interrogation-statements">
              {(c.statements || []).map((statement) => {
                const suspect = (c.suspects || []).find(
                  (item) => item.id === statement.suspectId
                );
                const related = (c.evidence || []).filter((evidence) =>
                  (statement.relatedEvidenceIds || []).includes(
                    evidence.id
                  )
                );
                const hasSelectedRelatedEvidence = related.some(
                  (evidence) => evidenceIds.includes(evidence.id)
                );
                const statementFeedback = feedback[statement.id];
                const isError = statementFeedback?.status === "error";
                return (
                  <article key={statement.id} className="interrogation-statement-card">
                    <p className="interrogation-suspect-name">
                      {suspect?.name || "Unknown suspect"}
                    </p>
                    <p className="interrogation-quote">
                      “{statement.text}”
                    </p>
                    <p className="interrogation-related-evidence">
                      Related evidence:{" "}
                      {related.length
                        ? related
                          .map(
                            (evidence) =>
                              `${evidence.title}${evidenceIds.includes(evidence.id)
                                ? " ✓"
                                : ""
                              }`
                          )
                          .join(" · ")
                        : "No related evidence listed"}
                    </p>
                    <button
                      type="button"
                      onClick={() => challenge(statement)}
                      disabled={
                        !hasSelectedRelatedEvidence ||
                        Boolean(loading[statement.id])
                      }
                      className="interrogation-challenge-button"
                    >
                      {loading[statement.id]
                        ? "Analyzing evidence..."
                        : "Challenge with selected evidence"}
                    </button>
                    {statementFeedback && (
                      <p
                        role="status"
                        aria-live="polite"
                        className={`interrogation-feedback ${isError ? "interrogation-feedback-error" : ""
                          }`}
                      >
                        <strong>
                          {statementFeedback.status.toUpperCase()}
                        </strong>
                        {statementFeedback.feedback}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
            <Link to="/deduction" className="interrogation-final-link">
              Make final deduction →
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}