import { useState } from "react";
import { useNavigate } from "react-router-dom";
import magnifierImage from "./detective-magnifier.jpg";
import DashboardImage from "./dashboard.jpeg";
import WhoImage from "./who.jpeg";
import navbarVintage from "./navbar-vintage.jpg";
import CASE1 from "./CASE1.jpeg";
import CASE2 from "./CASE2.jpeg";
import CASE3 from "./CASE3.jpeg";
import { useGame } from "../context/GameContext.jsx";
import CaseButton from "../components/CaseButton";
import { Search, FileText, Fingerprint, LockKeyhole, LogOut, ChevronLeft, ChevronRight, } from "lucide-react";

const cases = [
  {
    id: "001",
    title: "The Perfect Alibi",
    difficulty: "EASY",
    description: "A suspicious timeline, conflicting statements, and one alibi that may not hold up.",
    icon: Search,
    image: CASE1,
  },
  {
    id: "002",
    title: "The Missing Evidence",
    difficulty: "MEDIUM",
    description: "Evidence has disappeared. Examine the details and discover what someone is hiding.",
    icon: FileText,
    image: CASE2,
  },
  {
    id: "003",
    title: "The Final Suspect",
    difficulty: "HARD",
    description: "Every suspect has a story. Find the contradiction that reveals the truth.",
    icon: Fingerprint,
    image: CASE3,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeCase, setActiveCase] = useState(0);
  
  const { activateCase } = useGame();
  const [loadingId, setLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const previousCase = () => {
    setActiveCase(
      (current) => (current - 1 + cases.length) % cases.length
    );
  };

  const nextCase = () => {
    setActiveCase((current) => (current + 1) % cases.length);
  };

  const getPosition = (index) => {
    if (index === activeCase) return "center";
    if (index === (activeCase + 1) % cases.length) {
      return "right";
    }
    return "left";
  };

  
const handleLaunchCase = async (selectedCase) => {
  if (loadingId !== null) return;

  try {
    setLoadingId(selectedCase.id);
    setErrorMessage("");

    // Select the canonical case from data/cases.js via GameContext.
    const activated = activateCase(selectedCase.id);

    if (!activated) {
      throw new Error(
        `Could not find case ${selectedCase.id} in data/cases.js.`
      );
    }

    // Save the selected archive case consistently.
    const canonicalCase = {
      id: selectedCase.id,
      selectedCaseId: selectedCase.id,
      title: selectedCase.title,
      difficulty: selectedCase.difficulty,
      archiveTitle: selectedCase.title,
      archiveDifficulty: selectedCase.difficulty,
    };

    localStorage.setItem(
      "current_active_case",
      JSON.stringify(canonicalCase)
    );

    localStorage.setItem(
      "perfect-alibi-current-case",
      selectedCase.id
    );

    localStorage.setItem(
      `perfect-alibi-generated-case-${selectedCase.id}`,
      JSON.stringify(canonicalCase)
    );

    navigate("/investigation");
  } catch (error) {
    console.error("Failed to launch mystery case:", error);

    setErrorMessage(
      error.message || "Unable to open the case. Please try again."
    );
  } finally {
    setLoadingId(null);
  }
};


  return (
    <main className="dashboard-page"
      style={{
        backgroundImage: `url(${DashboardImage})`,
      }}>
      <div className="dashboard-overlay" aria-hidden="true" />
      <div className="dashboard-content">
        <nav className="dashboard-navbar">
          <div className="navbar-image">
            <img src={magnifierImage} alt="Detective magnifying glass" />
          </div>
          <div className="navbar-content">
            <div className="navbar-brand">
              <h1>The Deduction Matrix</h1>
            </div>
            <div className="navbar-actions">
              <button type="button" onClick={() => navigate("/")} className="exit-button">
                <LogOut size={20} strokeWidth={1.5} />
                <span>EXIT</span>
              </button>
            </div>
          </div>
        </nav>
        <section className="introduction-section">
          <div className="introduction-panel">
            <div className="introduction-image">
              <img src={WhoImage} alt="Detective investigation" />
              <div className="introduction-image-overlay" />
            </div>

            <div className="introduction-text-panel"
              style={{
                backgroundImage: `url(${navbarVintage})`,
              }}>
              <div className="parchment-overlay" />
              <div className="parchment-gradient" />
              <div className="introduction-text">
                <h2>Every detail tells a story.</h2>
                <p>
                  Examine the evidence, question the alibis, and
                  uncover the truth hidden beneath every suspicious
                  detail. Every witness has a story, every suspect
                  has a secret, and every clue brings you one step
                  closer to solving the mystery. Observe carefully,
                  connect the missing pieces, and challenge
                  everything that seems certain.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="archive-heading-section">
          <div className="archive-heading">
            <h2>Investigation Archive</h2>
          </div>
        </section>
        <section className="case-carousel-section">
          <div className="case-carousel">
            <button
              type="button"
              onClick={previousCase}
              aria-label="Previous case"
              disabled={loadingId !== null}
              className="carousel-arrow carousel-arrow-left"
            >
              <ChevronLeft size={25} />
            </button>
            <button
              type="button"
              onClick={nextCase}
              aria-label="Next case"
              disabled={loadingId !== null}
              className="carousel-arrow carousel-arrow-right"
            >
              <ChevronRight size={25} />
            </button>
            <div className="carousel-track">
              {cases.map((item, index) => {
                const position = getPosition(index);
                const isActive = index === activeCase;
                const Icon = item.icon;
                return (
                  <article
                    key={item.id}
                    aria-hidden={!isActive}
                    className={`case-card case-card-${position}`}
                  >
                    <div className="case-card-inner">
                      <div className="case-card-background">
                        <img src={item.image} alt="" />
                        <div className="case-image-overlay" />
                        <div className="case-gradient-overlay" />
                      </div>

                      <div className="case-card-content">
                        <div className="case-metadata">
                          <div>
                            <p className="classified-label">
                              CLASSIFIED FILE
                            </p>
                            <p className="case-number">
                              {item.id}
                            </p>
                          </div>
                          <span className="difficulty-label">
                            {item.difficulty}
                          </span>
                        </div>
                        <div className="case-details">
                          <div className="case-icon">
                            <Icon size={29} strokeWidth={1.5} />
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                        <div className="case-card-footer">
                          <div className="confidential-label">
                            <LockKeyhole size={16} />
                            <span>CONFIDENTIAL</span>
                          </div>
                          <CaseButton
                            onClick={() => handleLaunchCase(item)}
                            isActive={isActive}
                            isLoading={loadingId === item.id}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="carousel-indicators">
              {cases.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCase(index)}
                  disabled={loadingId !== null}
                  aria-label={`Show ${item.title}`}
                  aria-current={
                    index === activeCase ? "true" : undefined
                  }
                  className={`carousel-indicator ${index === activeCase ? "carousel-indicator-active" : ""}`}
                />
              ))}
            </div>

            {errorMessage && (
              <p role="alert" className="dashboard-error">
                {errorMessage}
              </p>
            )}
            {loadingId !== null && (
              <p role="status" className="dashboard-loading">
                Generating your mystery case. Please wait...
              </p>
            )}
          </div>
        </section>
        <footer className="dashboard-footer">
          <div className="footer-content">
            <p className="footer-brand">
              THE DEDUCTION MATRIX
            </p>
            <p className="footer-tagline">
              THINK CRITICALLY. FOLLOW THE EVIDENCE. FIND THE TRUTH.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
