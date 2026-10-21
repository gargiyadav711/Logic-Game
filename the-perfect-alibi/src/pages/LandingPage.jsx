import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import navbarVintage from "./navbar-vintage.jpg";
import landingImage from "./landing.jpg";
import magnifierImage from "./detective-magnifier.jpg";
export default function LandingPage() {
  const navigate = useNavigate();
  const message = "Every mystery leaves a trace. Every alibi hides a truth.";
  const [displayedText, setDisplayedText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let timeout;
    if (!deleting && displayedText === message) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayedText === "") {
      timeout = setTimeout(() => setDeleting(false), 800);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText(
          deleting
            ? message.slice(0, displayedText.length - 1)
            : message.slice(0, displayedText.length + 1)
        );
      }, deleting ? 30 : 65);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, deleting]);

  return (
    <main className="landing-page">
      {/* Full-screen detective background */}
      <div
        className="landing-background"
        style={{ backgroundImage: `url(${landingImage})` }}
        aria-hidden="true"
      />
      <div className="landing-overlay" aria-hidden="true" />

      {/* Parchment banner */}
      <header
        className="vintage-banner"
        style={{ backgroundImage: `url(${navbarVintage})` }}
      >
        <img
          src={magnifierImage}
          alt=""
          className="banner-magnifier"
        />

        <div className="banner-text">
          <p className="typewriter-text">
            {displayedText}
            <span className="typewriter-cursor">|</span>
          </p>

          <div className="banner-ornament">
            ❧ ───── ✧ ───── ❧
          </div>
        </div>
      </header>

      {/* Centered hero content */}
      <section className="hero-content">
        <p className="hero-eyebrow">
          <span />
          A WORLD OF SECRETS AWAITS
          <span />
        </p>

        <h1 className="fantasy-title">
          The Deduction Matrix
        </h1>

        <p className="hero-subtitle">
          Every suspect has a story. Every clue has a secret.
        </p>

        <div className="hero-divider">
          <span />
          <span className="divider-diamond">✧</span>
          <span />
        </div>

        <button
          className="investigation-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>START INVESTIGATION</span>
          <span className="button-arrow" aria-hidden="true" />
        </button>
      </section>
    </main>
  );
}
