import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import navbarVintage from "./navbar-vintage.jpg";
import landingImage from "./landing.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import LightShaftText from "../components/LightShaftText";
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
        ctx.fillStyle = Math.random() > 0.88? "rgba(255, 225, 157, 0.75)" : "rgba(201, 160, 91, 0.32)";
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
        for (let j = 0; j < Math.ceil(height / fontSize); j++) {
          if (Math.random() > 0.58) {
            ctx.fillStyle = "rgba(201, 160, 91, 0.24)";
            ctx.fillText(
              characters[Math.floor(Math.random() * characters.length)],
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
    <canvas ref={canvasRef} className="glyph-wall-canvas" aria-hidden="true"/>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const message ="Every mystery leaves a trace. Every alibi hides a truth.";
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
  }, [displayedText, deleting, message]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
          });
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
      <div className="landing-background"
        style={{
          backgroundImage: `url(${landingImage})`,
        }}
        aria-hidden="true"/>
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
      <header
        className="vintage-banner"
        style={{
          backgroundImage: `url(${navbarVintage})`,
        }}>
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
        <section className="mystery-video-section" aria-label="Mystery introduction video" >
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
        <button className="investigation-button" onClick={() => navigate("/dashboard")}>
          <span>START INVESTIGATION</span>
          <span className="button-arrow" aria-hidden="true" />
        </button>
        <div className="hero-stamp" aria-hidden="true">
          <span>CLASSIFIED</span>
          <span>CASE FILE</span>
        </div>
      </section>
    </main>
  );
}
