import { Link, NavLink } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import TimelineEvent from "../components/TimelineEvent.jsx";
import { validateTimeline } from "../services/logicEngine.js";
import { LayoutDashboard, Search, Users, Network, Clock3, Brain, ArrowLeft, } from "lucide-react";
import sidebarImage from "./sidebar.jpg";
import backdropImage from "./backdrop.jpg";
import magnifierImage from "./detective-magnifier.jpg";
const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigation", path: "/investigation", icon: Search },
  { label: "Suspects", path: "/suspects", icon: Users },
  { label: "Evidence Board", path: "/evidence", icon: Network },
  { label: "Timeline", path: "/timeline", icon: Clock3 },
  { label: "Final Deduction", path: "/deduction", icon: Brain },
];

export default function Timeline() {
  const {
    activeCase: c,
    caseProgress,
    updateCaseProgress,
  } = useGame();

  if (!c) {
    return (
      <>
        <style>{`
          .timeline-no-case {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #17110e;
            color: #f5edd2;
            font-family: Arial, sans-serif;
          }

          .timeline-no-case a {
            color: #d7b778;
            text-decoration: underline;
            margin-left: 5px;
          }
        `}</style>
        <p className="timeline-no-case">
          No active case.
          <Link to="/dashboard">Open a case</Link>.
        </p>
      </>
    );
  }
  const canonical = (c.timeline || []).slice().sort((a, b) => a.order - b.order);
  const savedOrder = caseProgress.timelineOrder;
  const ids = savedOrder?.length === canonical.length ? savedOrder : canonical.map((event) => event.id);
  const events = ids.map((id) => canonical.find((event) => event.id === id)).filter(Boolean);
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= events.length) return;
    const next = [...events];
    [next[index], next[target]] = [next[target], next[index]];
    updateCaseProgress({
      timelineOrder: next.map((event) => event.id),
      stage: "timeline",
    });
  };
  const result = validateTimeline(
    c,
    events.map((event) => event.id)
  );
  return (
    <>
      <style>{`
        .timeline-app {
          display: flex;
          min-height: 100vh;
          background: #17110e;
          color: #f5edd2;
          font-family: Arial, Helvetica, sans-serif;
        }
        .timeline-sidebar {
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

        .timeline-brand {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 112px;
          padding: 16px 14px;
          border-bottom: 1px solid rgba(215, 183, 120, 0.2);
          overflow: hidden;
        }

        .timeline-brand-image {
          flex-shrink: 0;
          width: 70px;
          height: 78px;
          object-fit: contain;
          object-position: center;
          margin-right: 8px;
          filter: sepia(0.25) brightness(0.9);
        }

        .timeline-brand-copy {
          min-width: 0;
        }

        .timeline-brand-title {
          margin: 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.3px;
        }

        .timeline-brand-subtitle {
          margin: 7px 0 0;
          color: #c6a66c;
          font-size: 8px;
          letter-spacing: 1.5px;
          line-height: 1.6;
        }

        .timeline-nav-heading {
          margin: 26px 20px 12px;
          color: rgba(245, 237, 210, 0.4);
          font-size: 9px;
          letter-spacing: 2px;
        }

        .timeline-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 12px;
        }

        .timeline-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 44px;
          padding: 11px 13px;
          color: rgba(245, 237, 210, 0.68);
          border: 1px solid transparent;
          text-decoration: none;
          font-size: 13px;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .timeline-nav-link:hover {
          color: #f5edd2;
          background: rgba(215, 183, 120, 0.08);
          border-color: rgba(215, 183, 120, 0.15);
        }

        .timeline-nav-link.active {
          color: #21170f;
          background: #d7b778;
          border-color: #d7b778;
          font-weight: 600;
        }

        .timeline-nav-icon {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
        }

        .timeline-sidebar-footer {
          margin-top: auto;
          padding: 20px 18px;
          border-top: 1px solid rgba(215, 183, 120, 0.2);
        }

        .timeline-case-label {
          margin: 0 0 8px;
          color: #c6a66c;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .timeline-case-status {
          margin: 0;
          color: rgba(245, 237, 210, 0.55);
          font-size: 10px;
          line-height: 1.7;
        }

        .timeline-back-link {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 18px;
          color: #f5edd2;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.2s ease;
        }

        .timeline-back-link:hover {
          color: #d7b778;
        }

        .timeline-back-icon {
          width: 16px;
          height: 16px;
        }
        .timeline-main {
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

        .timeline-content {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 52px 48px 64px;
        }

        .timeline-eyebrow {
          margin: 0;
          color: rgba(215, 183, 120, 0.75);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .timeline-title {
          margin: 12px 0 0;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 500;
          line-height: 1.2;
        }

        .timeline-description {
          max-width: 680px;
          margin: 16px 0 0;
          color: rgba(245, 237, 210, 0.62);
          font-size: 14px;
          line-height: 1.9;
        }

        .timeline-divider {
          width: 100%;
          height: 1px;
          margin: 27px 0;
          background: linear-gradient(
            to right,
            rgba(215, 183, 120, 0.55),
            rgba(215, 183, 120, 0.03)
          );
        }

        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .timeline-score {
          margin: 22px 0 0;
          padding: 14px 16px;
          border-left: 2px solid #d7b778;
          background: rgba(215, 183, 120, 0.07);
          color: #e8d4a5;
          font-size: 13px;
          line-height: 1.7;
        }

        .timeline-score strong {
          color: #f5edd2;
          font-weight: 600;
        }

        .timeline-continue {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
          padding: 12px 18px;
          border: 1px solid rgba(215, 183, 120, 0.55);
          background: rgba(0, 0, 0, 0.18);
          color: #f5edd2;
          font-size: 12px;
          letter-spacing: 0.4px;
          text-decoration: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .timeline-continue:hover {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
        }

        @media (max-width: 900px) {
          .timeline-sidebar {
            width: 220px;
          }

          .timeline-main {
            margin-left: 220px;
          }

          .timeline-content {
            padding: 40px 28px 50px;
          }

          .timeline-brand-title {
            font-size: 17px;
          }

          .timeline-brand-image {
            width: 56px;
          }
        }

       

@media (max-width: 650px) {
  .timeline-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  /* Mobile sidebar — matches Evidence Board */
  .timeline-sidebar {
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

  .timeline-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 0;
    padding: 16px;
    border-bottom: none;
    overflow: visible;
  }

  .timeline-brand-image {
    flex: 0 0 38px;
    width: 38px;
    height: 42px;
    margin-right: 0;
  }

  .timeline-brand-copy {
    min-width: 0;
  }

  .timeline-brand-title {
    font-size: 17px;
  }

  .timeline-brand-subtitle {
    margin-top: 6px;
    font-size: 8px;
  }

  .timeline-nav-heading,
  .timeline-sidebar-footer {
    display: none;
  }

  /* Horizontal scrolling navigation */
  .timeline-nav {
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

  .timeline-nav::-webkit-scrollbar {
    display: none;
  }

  .timeline-nav-link {
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

  .timeline-nav-link:hover {
    color: #fff0d0;
    background: rgba(107, 75, 43, 0.5);
  }

  .timeline-nav-link.active {
    border-color: #d7b778;
    color: #21150b;
    background: #d7b778;
  }

  .timeline-nav-icon {
    flex: 0 0 15px;
    width: 15px;
    height: 15px;
  }

  /* Main content below the navbar */
  .timeline-main {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    margin-left: 0;

    background-attachment: scroll;
  }

  .timeline-content {
    width: 100%;
    padding: 30px 18px 44px;
  }

  .timeline-title {
    font-size: 34px;
  }

  .timeline-description {
    font-size: 13px;
  }
}

@media (max-width: 420px) {
  .timeline-brand {
    padding: 14px 12px;
    gap: 8px;
  }

  .timeline-brand-image {
    flex-basis: 38px;
    width: 38px;
    height: 42px;
  }

  .timeline-brand-title {
    font-size: 16px;
  }

  .timeline-brand-subtitle {
    font-size: 7px;
    letter-spacing: 0.8px;
  }

  .timeline-nav {
    padding-right: 12px;
    padding-left: 12px;
  }

  .timeline-main {
    padding: 0;
  }

  .timeline-content {
    padding: 26px 14px 36px;
  }

  .timeline-title {
    font-size: 30px;
  }
}



        @media (prefers-reduced-motion: reduce) {
          .timeline-nav-link,
          .timeline-back-link,
          .timeline-continue {
            transition: none;
          }
        }
      `}</style>

      <div className="timeline-app">
        <aside className="timeline-sidebar">
          <div className="timeline-brand">
            <img
              src={magnifierImage}
              alt=""
              className="timeline-brand-image"
            />

            <div className="timeline-brand-copy">
              <h1 className="timeline-brand-title">
                The Deduction Matrix
              </h1>
              <p className="timeline-brand-subtitle">
                PRIVATE INVESTIGATION DIVISION
              </p>
            </div>
          </div>

          <p className="timeline-nav-heading">INVESTIGATION</p>

          <nav className="timeline-nav">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `timeline-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="timeline-nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="timeline-sidebar-footer">
            <Link
              to="/dashboard"
              className="timeline-back-link"
            >
              <ArrowLeft className="timeline-back-icon" />
              <span>Back to dashboard</span>
            </Link>
          </div>
        </aside>

        <main className="timeline-main">
          <section className="timeline-content">
            <p className="timeline-eyebrow">Chronology / Case Analysis</p>

            <h2 className="timeline-title">
              Reconstruct the Timeline
            </h2>

            <p className="timeline-description">
              Use the arrows to arrange events from earliest to latest.
              Review each detail carefully and reconstruct the sequence
              that best fits the evidence.
            </p>

            <div className="timeline-divider" />

            <div className="timeline-events">
              {events.map((event, index) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  index={index}
                  total={events.length}
                  onMove={move}
                />
              ))}
            </div>
            <Link to="/interrogation" className="timeline-continue">
              Continue to interrogation →
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}