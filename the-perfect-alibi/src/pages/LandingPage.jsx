import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import navbarVintage from "./navbar-vintage.jpg";
import landingImage from "./landing.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import LightShaftText from "../components/LightShaftText";

const tutorialSteps = [
  {
    number: "01",
    title: "Investigate the Crime Scene",
    description:"Read the case briefing carefully. Understand what happened, when it happened, and who was involved. Explore the available clues to uncover important details.",
  },
  {
    number: "02",
    title: "Examine the Suspects",
    description:"Review each suspect's profile, motive, alibi, and statements. Look for details that do not match the available evidence.",
  },
  {
    number: "03",
    title: "Analyze the Evidence",
    description: "Inspect photographs, documents, witness accounts, and physical clues. Determine what each piece of evidence actually proves.",
  },
  {
    number: "04",
    title: "Connect Clues on the Evidence Board",
    description:"Connect relevant evidence with suspect statements. Identify which claims are supported, contradicted, or still unresolved.",
  },
  {
    number: "05",
    title: "Reconstruct the Timeline",
    description:"Arrange events in chronological order. Compare timestamps and witness accounts to uncover impossible timings and inconsistent alibis.",
  },
  {
    number: "06",
    title: "Challenge Suspect Statements",
    description:"Select a suspicious claim and challenge it using relevant evidence. Build a logical argument instead of making assumptions.",
  },
  {
    number: "07",
    title: "Make Your Final Accusation",
    description:"Identify the culprit and submit your conclusion. Explain how the evidence and contradictions support your accusation.",
  },
  {
    number: "08",
    title: "Earn Your Detective Score",
    description:"Earn points for correct deductions, evidence connections, contradiction detection, timeline accuracy, and a well-supported accusation.",
  },
  {
    number: "09",
    title: "Track Your Progress",
    description:"Review completed investigations, saved progress, detective scores, and newly unlocked cases as you advance.",
  },
  {
    number: "10",
    title: "Master Every Difficulty",
    description:"Progress through increasingly difficult mysteries featuring conflicting alibis, unreliable timestamps, misleading statements, and interconnected clues.",
  },
];
function GlyphWall() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrame;
    let lastFrame = 0;
    let columns = 0;
    let drops = [];
    let width = 0;
    let height = 0;
    const fontSize = 16;
    const characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコ◆◇✦✧";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / fontSize);
      drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
      );
      ctx.clearRect(0, 0, width, height);
    };
    const drawGlyphs = (timestamp) => {
      animationFrame = requestAnimationFrame(drawGlyphs);
      if (timestamp - lastFrame < 65) return;
      lastFrame = timestamp;
      ctx.fillStyle = "rgba(10, 9, 7, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px Georgia, serif`;
      ctx.textAlign = "center";
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize;
        const character =
          characters[
            Math.floor(Math.random() * characters.length)
          ];
        ctx.fillStyle =
          Math.random() > 0.88
            ? "rgba(255, 225, 157, 0.75)"
            : "rgba(201, 160, 91, 0.32)";
        ctx.fillText(character, x, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.45 + Math.random() * 0.45;
        }
      }
    };
    resizeCanvas();
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);
    if (reducedMotion.matches) {
      ctx.font = `${fontSize}px Georgia, serif`;
      ctx.textAlign = "center";
      for (let i = 0; i < columns; i++) {
        for (
          let j = 0;
          j < Math.ceil(height / fontSize);
          j++
        ) {
          if (Math.random() > 0.58) {
            ctx.fillStyle = "rgba(201, 160, 91, 0.24)";
            ctx.fillText(
              characters[
                Math.floor(Math.random() * characters.length)
              ],
              i * fontSize + fontSize / 2,
              j * fontSize
            );
          }
        }
      }
    } else {
      animationFrame = requestAnimationFrame(drawGlyphs);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="glyph-wall-canvas"
      aria-hidden="true"
    />
  );
}
export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const message ="Every mystery leaves a trace. Every alibi hides a truth.";
  const [displayedText, setDisplayedText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);
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
  }, [displayedText, deleting, message]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);
  return (
    <main className="landing-page">
      <div
        className="landing-background"
        style={{
          backgroundImage: `url(${landingImage})`,
        }}
        aria-hidden="true"
      />
      <div className="landing-overlay" aria-hidden="true" />
      <div className="ambient-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            style={{
              "--i": i,
              "--x": `${(i * 37 + 9) % 100}%`,
              "--delay": `${(i % 7) * -1.3}s`,
              "--duration": `${7 + (i % 6)}s`,
            }}
          />
        ))}
      </div>
      <header className="vintage-banner"
        style={{
          backgroundImage: `url(${navbarVintage})`,
        }}
      >
        <div className="banner-depth" aria-hidden="true" />
        <img src={magnifierImage} alt="" className="banner-magnifier"/>
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
      <section className="hero-content">
        <div className="glyph-wall-layer" aria-hidden="true">
          <GlyphWall />
        </div>
        <p className="hero-eyebrow">
          <span />
          A WORLD OF SECRETS AWAITS
          <span />
        </p>
        <div className="landing-wordmark light-shaft-wordmark">
          <LightShaftText
            text="THE DEDUCTION MATRIX"
            font={{
              fontFamily: "Georgia, serif",
              fontWeight: 800,
              fontSize: 80,
              letterSpacing: "0.04em",
            }}
            background="transparent"
            textColor="#F3E3BD"
            lineColor="#E7C987"
            speed={35}
            offsetY={0}
            interactive={true}
            pointerIntensity={35}
            lines={{
              density: 150,
              width: 24,
              softness: 55,
              depth: 13,
              overshoot: 35,
              flicker: 65,
            }}
            style={{
              width: "100%",
              height: "320px",
            }}
          />
        </div>
        <p className="hero-subtitle">
          Every suspect has a story. Every clue has a secret.
        </p>
        <div className="hero-divider">
          <span />
          <span className="divider-diamond">✧</span>
          <span />
        </div>
        <section className="mystery-video-section"aria-label="Mystery introduction video">
          <p className="video-eyebrow">
            <span className="video-line" />
            THE CASE BEGINS
            <span className="video-line" />
          </p>
          <div className="mystery-video-inner">
            <video
              ref={videoRef}
              className="mystery-video"
              muted
              playsInline
              preload="metadata"
              controls
            >
              <source src="/VIDEO.mp4" type="video/mp4" />
              Your browser does not support this video.
            </video>
          </div>
        </section>
        <button
          className="investigation-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>START INVESTIGATION</span>
          <span className="button-arrow" aria-hidden="true" />
        </button>
        <section className="how-to-play" aria-labelledby="tutorial-heading">
          <div className="tutorial-heading">
            <span className="tutorial-eyebrow">
              ❧ &nbsp; YOUR DETECTIVE'S HANDBOOK &nbsp; ❧
            </span>
            <h2 id="tutorial-heading">HOW TO PLAY</h2>
            <p>
              Follow the trail. Question every alibi. Discover
              the truth.
            </p>
            <div className="tutorial-heading-divider">
              <span />
              ✧
              <span />
            </div>
          </div>
          <div className="tutorial-path">
            <svg
              className="tutorial-path-line"
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="
                  M 100 55
                  C 230 15, 300 100, 450 55
                  S 750 20, 900 65
                  C 1030 110, 940 180, 800 180
                  S 350 150, 150 190
                  C 10 230, 70 300, 250 310
                  S 700 280, 900 330
                  C 1010 370, 900 440, 700 440
                  S 300 420, 100 455
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="7 9"
                strokeLinecap="round"
              />
            </svg>
            <div className="tutorial-grid">
              {tutorialSteps.map((step, index) => (
                <button
                  type="button"
                  key={step.number}
                  className={`tutorial-step ${
                    activeTutorial === index
                      ? "tutorial-step-active"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTutorial((current) =>
                      current === index ? null : index
                    );
                  }}
                  onMouseEnter={() => setActiveTutorial(index)}
                  onMouseLeave={() => setActiveTutorial(null)}
                  onFocus={() => setActiveTutorial(index)}
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget
                      )
                    ) {
                      setActiveTutorial(null);
                    }
                  }}
                  aria-expanded={activeTutorial === index}
                  aria-controls={`tutorial-detail-${step.number}`}
                >
                  <span className="tutorial-number">
                    {step.number}
                  </span>
                  <span className="tutorial-step-title">
                    {step.title}
                  </span>
                  <span
                    id={`tutorial-detail-${step.number}`}
                    className="tutorial-popup"
                    aria-hidden={activeTutorial !== index}
                  >
                    <span className="tutorial-popup-label">
                      CASE NOTE {step.number}
                    </span>
                    <span className="tutorial-popup-title">
                      {step.title}
                    </span>
                    <span className="tutorial-popup-description">
                      {step.description}
                    </span>
                    <span className="tutorial-popup-footer">
                      <span>DETECTIVE'S FILE</span>
                      <span>✧</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="tutorial-footer">
            <p>
              Every clue matters. Every contradiction counts.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
