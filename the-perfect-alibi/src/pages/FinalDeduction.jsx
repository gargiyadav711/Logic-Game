import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import { validateFinalAccusation } from "../services/validationService.js";
import { saveAttempt } from "../services/storageService.js";
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

export default function FinalDeduction() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
    refreshProgress,
  } = useGame();
  const [suspectId, setSuspectId] = useState(
    caseProgress.selectedSuspectId || ""
  );
  const [explanation, setExplanation] = useState(
    caseProgress.explanation || ""
  );
  const [evidenceIds, setEvidenceIds] = useState(
    caseProgress.selectedEvidenceIds || caseProgress.collectedEvidenceIds || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!c) {
    return (
      <>
        <style>{`
          .deduction-no-case {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #17110e;
            color: #f5edd2;
            font-family: Arial, sans-serif;
          }

          .deduction-no-case a {
            margin: 0 5px;
            color: #d7b778;
          }
        `}</style>

        <p className="deduction-no-case">
          No active case.
          <Link to="/dashboard">Open a case</Link>.
        </p>
      </>
    );
  }

  const toggleEvidence = (id, checked) => {
    setEvidenceIds((previous) => checked ? [...new Set([...previous, id])] : previous.filter((item) => item !== id));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!suspectId || explanation.trim().length < 20) {
      setError(
        "Choose a suspect and write an explanation of at least 20 characters."
      );
      return;
    }
    if (evidenceIds.length === 0) {
      setError("Select at least one piece of supporting evidence.");
      return;
    }
    setLoading(true);
    setError("");
    const attempt = {
      selectedSuspectId: suspectId,
      explanation: explanation.trim(),
      selectedEvidenceIds: evidenceIds,
      challengedStatementIds:
        caseProgress.challengedStatementIds || [],
      timelineOrder: caseProgress.timelineOrder || [],
    };
    try {
      const result = await validateFinalAccusation(c, attempt);
      const attemptId = `${c.id}-${Date.now()}`;
      const finalResult = {
        ...result,
        attemptId,
        caseId: c.id,
        caseTitle: c.title,
        selectedSuspectId: suspectId,
        explanation: explanation.trim(),
        evidenceIds,
        completedAt: new Date().toISOString(),
      };

      updateCaseProgress({
        ...attempt,
        selectedSuspectId: suspectId,
        explanation: explanation.trim(),
        selectedEvidenceIds: evidenceIds,
        completed: true,
        score: result.score,
        result: finalResult,
        stage: "solved",
        attempts: (caseProgress.attempts || 0) + 1,
      });

      saveAttempt(finalResult);
      refreshProgress();
      navigate("/case-solved", {
        state: { result: finalResult },
      });
    } catch (err) {
      setError(
        err.message ||
        "Could not validate your accusation. Your progress has been preserved."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .deduction-app {
          display: flex;
          min-height: 100vh;
          background: #17110e;
          color: #f5edd2;
          font-family: Arial, Helvetica, sans-serif;
        }
        .deduction-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          width: 256px;
          height: 100vh;
          overflow-y: auto;
          background-image: url("${sidebarImage}");
          background-position: center;
          background-size: cover;
          border-right: 1px solid rgba(215, 183, 120, 0.2);
        }

        .deduction-brand {
          display: flex;
          align-items: center;
          min-height: 112px;
          padding: 16px 14px;
          overflow: hidden;
          border-bottom: 1px solid rgba(215, 183, 120, 0.2);
        }

        .deduction-brand-image {
          flex-shrink: 0;
          width: 70px;
          height: 78px;
          margin-right: 8px;
          object-fit: contain;
          object-position: center;
          filter: sepia(0.25) brightness(0.9);
        }

        .deduction-brand-copy {
          min-width: 0;
        }

        .deduction-brand-title {
          margin: 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.2;
        }

        .deduction-brand-subtitle {
          margin: 7px 0 0;
          color: #c6a66c;
          font-size: 8px;
          letter-spacing: 1.5px;
          line-height: 1.6;
        }

        .deduction-nav-heading {
          margin: 26px 20px 12px;
          color: rgba(245, 237, 210, 0.4);
          font-size: 9px;
          letter-spacing: 2px;
        }

        .deduction-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 12px;
        }

        .deduction-nav-link {
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

        .deduction-nav-link:hover {
          border-color: rgba(215, 183, 120, 0.15);
          background: rgba(215, 183, 120, 0.08);
          color: #f5edd2;
        }

        .deduction-nav-link.active {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
          font-weight: 600;
        }

        .deduction-nav-icon {
          flex-shrink: 0;
          width: 17px;
          height: 17px;
        }

        .deduction-sidebar-footer {
          margin-top: auto;
          padding: 20px 18px;
          border-top: 1px solid rgba(215, 183, 120, 0.2);
        }

        .deduction-case-label {
          margin: 0 0 8px;
          color: #c6a66c;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .deduction-case-status {
          margin: 0;
          color: rgba(245, 237, 210, 0.55);
          font-size: 10px;
          line-height: 1.7;
        }

        .deduction-back-link {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 18px;
          color: #f5edd2;
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .deduction-back-link:hover {
          color: #d7b778;
        }

        .deduction-back-icon {
          width: 16px;
          height: 16px;
        }
        .deduction-main {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          margin-left: 256px;
          background-image:url("${backdropImage}");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .deduction-content {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 52px 48px 64px;
        }

        .deduction-eyebrow {
          margin: 0;
          color: rgba(215, 183, 120, 0.75);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .deduction-title {
          margin: 12px 0 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 500;
          line-height: 1.2;
        }

        .deduction-description {
          max-width: 700px;
          margin: 16px 0 0;
          color: rgba(245, 237, 210, 0.62);
          font-size: 14px;
          line-height: 1.9;
        }

        .deduction-divider {
          height: 1px;
          margin: 27px 0;
          background: linear-gradient(
            to right,
            rgba(215, 183, 120, 0.55),
            rgba(215, 183, 120, 0.03)
          );
        }

        .deduction-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 760px;
        }

        .deduction-field-label {
          display: block;
          color: rgba(245, 237, 210, 0.9);
          font-size: 13px;
          line-height: 1.7;
        }

        .deduction-select,
        .deduction-textarea {
          display: block;
          width: 100%;
          margin-top: 9px;
          padding: 13px 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          outline: none;
          background: rgba(32, 27, 21, 0.95);
          color: #f5edd2;
          font-family: inherit;
          font-size: 13px;
          transition: border-color 0.2s ease;
        }

        .deduction-select {
          min-height: 46px;
        }

        .deduction-select option {
          background: #201b15;
          color: #f5edd2;
        }

        .deduction-select:focus,
        .deduction-textarea:focus {
          border-color: #d7b778;
        }

        .deduction-textarea {
          min-height: 145px;
          resize: vertical;
          line-height: 1.8;
        }

        .deduction-textarea::placeholder {
          color: rgba(245, 237, 210, 0.38);
        }

        .deduction-fieldset {
          min-width: 0;
          margin: 0;
          padding: 0;
          border: 0;
        }

        .deduction-legend {
          margin-bottom: 12px;
          color: rgba(245, 237, 210, 0.9);
          font-size: 13px;
        }

        .deduction-evidence-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .deduction-evidence-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
          color: #f5edd2;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .deduction-evidence-card:hover {
          border-color: rgba(215, 183, 120, 0.4);
        }

        .deduction-evidence-card.selected {
          border-color: rgba(215, 183, 120, 0.65);
          background: rgba(215, 183, 120, 0.08);
        }

        .deduction-evidence-checkbox {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          margin-top: 3px;
          accent-color: #f5d98e;
          cursor: pointer;
        }

        .deduction-evidence-copy {
          min-width: 0;
          font-size: 13px;
          line-height: 1.7;
        }

        .deduction-evidence-title {
          display: block;
          color: #f5edd2;
          font-weight: 600;
        }

        .deduction-evidence-detail {
          display: block;
          margin-top: 3px;
          color: rgba(245, 237, 210, 0.5);
          font-size: 12px;
          line-height: 1.7;
        }

        .deduction-error {
          margin: 0;
          padding: 12px 14px;
          border-left: 2px solid #d18b78;
          background: rgba(209, 139, 120, 0.08);
          color: #e7b5a6;
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .deduction-submit {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 13px 19px;
          border: 1px solid rgba(215, 183, 120, 0.6);
          background: rgba(215, 183, 120, 0.1);
          color: #f5edd2;
          font-size: 11px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .deduction-submit:hover:not(:disabled) {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
        }

        .deduction-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .deduction-submit:focus-visible,
        .deduction-evidence-card:focus-within {
          outline: 2px solid #d7b778;
          outline-offset: 3px;
        }
        @media (max-width: 900px) {
          .deduction-sidebar {
            width: 220px;
          }

          .deduction-main {
            margin-left: 220px;
          }

          .deduction-content {
            padding: 40px 28px 50px;
          }

          .deduction-brand-title {
            font-size: 17px;
          }

          .deduction-brand-image {
            width: 56px;
          }
        }

       
@media (max-width: 650px) {
  .deduction-app {
    display: block;
  }

  .deduction-sidebar {
    position: sticky;
    width: 100%;
    height: auto;
    max-height: none;
    overflow: visible;
  }

  .deduction-brand {
    min-height: 85px;
    padding: 10px 16px;
  }

  .deduction-brand-image {
    width: 50px;
    height: 58px;
  }

  .deduction-nav-heading {
    margin: 12px 16px 6px;
  }

  /* Horizontal sliding mobile navbar */
  .deduction-nav {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 6px;
    width: 100%;
    padding: 0 12px 8px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .deduction-nav::-webkit-scrollbar {
    display: none;
  }

  .deduction-nav-link {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: auto;
    min-height: 38px;
    padding: 9px 12px;
    border: 1px solid transparent;
    border-bottom: 2px solid transparent;
    font-size: 11px;
    white-space: nowrap;
  }

  .deduction-nav-link.active {
    border-color: transparent;
    border-bottom-color: #d7b778;
    background: rgba(215, 183, 120, 0.12);
    color: #f5edd2;
  }

  .deduction-nav-icon {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
  }

  .deduction-sidebar-footer {
    display: none;
  }

  .deduction-main {
    min-height: 70vh;
    margin-left: 0;
    background-attachment: scroll;
  }

  .deduction-content {
    padding: 32px 18px 44px;
  }

  .deduction-title {
    font-size: 34px;
  }

  .deduction-description {
    font-size: 13px;
  }

  .deduction-submit {
    width: 100%;
  }
}


        @media (prefers-reduced-motion: reduce) {
          .deduction-nav-link,
          .deduction-back-link,
          .deduction-evidence-card,
          .deduction-select,
          .deduction-textarea,
          .deduction-submit {
            transition: none;
          }
        }
      `}</style>

      <div className="deduction-app">
        <aside className="deduction-sidebar">
          <div className="deduction-brand">
            <img
              src={magnifierImage}
              alt=""
              className="deduction-brand-image"
            />

            <div className="deduction-brand-copy">
              <h1 className="deduction-brand-title">
                The Deduction Matrix
              </h1>
              <p className="deduction-brand-subtitle">
                PRIVATE INVESTIGATION DIVISION
              </p>
            </div>
          </div>

          <p className="deduction-nav-heading">INVESTIGATION</p>

          <nav className="deduction-nav">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `deduction-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="deduction-nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="deduction-sidebar-footer">
            <Link to="/dashboard" className="deduction-back-link">
              <ArrowLeft className="deduction-back-icon" />
              <span>Back to dashboard</span>
            </Link>
          </div>
        </aside>

        <main className="deduction-main">
          <section className="deduction-content">
            <p className="deduction-eyebrow">
              Case Conclusion
            </p>
            <h2 className="deduction-title">
              Who is responsible?
            </h2>
            <p className="deduction-description">
              Build your final accusation using the evidence you have
              collected. Select the suspect, identify the evidence that
              supports your conclusion, and explain how the facts connect.
            </p>
            <div className="deduction-divider" />
            <form onSubmit={submit} className="deduction-form">
              <label className="deduction-field-label">
                Accuse a suspect
                <select
                  value={suspectId}
                  onChange={(event) => setSuspectId(event.target.value)}
                  className="deduction-select"
                  required
                >
                  <option value="">Select suspect...</option>
                  {(c.suspects || []).map((suspect) => (
                    <option
                      key={suspect.id}
                      value={suspect.id}
                    >
                      {suspect.name} — {suspect.role}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="deduction-fieldset">
                <legend className="deduction-legend">
                  Evidence supporting your accusation
                </legend>
                <div className="deduction-evidence-list">
                  {(c.evidence || []).map((evidence) => {
                    const selected = evidenceIds.includes(evidence.id);
                    return (
                      <label
                        key={evidence.id}
                        className={`deduction-evidence-card ${selected ? "selected" : ""
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) =>
                            toggleEvidence(
                              evidence.id,
                              event.target.checked
                            )
                          }
                          className="deduction-evidence-checkbox"
                        />
                        <span className="deduction-evidence-copy">
                          <span className="deduction-evidence-title">
                            {evidence.title}
                          </span>
                          <span className="deduction-evidence-detail">
                            {evidence.detail}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label className="deduction-field-label">
                Explain your deduction
                <textarea
                  value={explanation}
                  onChange={(event) =>
                    setExplanation(event.target.value)
                  }
                  rows={5}
                  className="deduction-textarea"
                  placeholder="Explain which evidence contradicts the alibi and why..."
                  required
                  minLength={20}
                />
              </label>
              {error && (
                <p role="alert" className="deduction-error">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="deduction-submit"
              >
                {loading ? "VALIDATING..." : "SUBMIT FINAL ACCUSATION"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}