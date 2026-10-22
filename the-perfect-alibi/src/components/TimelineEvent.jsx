export default function TimelineEvent({ event, index, total, onMove }) {
  return (
    <>
      <style>{`
        .timeline-event-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
          color: #f5edd2;
          transition:
            border-color 0.25s ease,
            background-color 0.25s ease;
        }

        .timeline-event-card:hover {
          border-color: rgba(215, 183, 120, 0.4);
          background: rgba(0, 0, 0, 0.3);
        }

        .timeline-event-number {
          flex-shrink: 0;
          color: rgba(245, 217, 142, 0.7);
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 22px;
          line-height: 1.4;
        }

        .timeline-event-details {
          flex: 1;
          min-width: 0;
        }

        .timeline-event-time {
          margin: 0;
          color: rgba(245, 217, 142, 0.65);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .timeline-event-description {
          margin: 6px 0 0;
          color: rgba(245, 237, 210, 0.92);
          font-size: 14px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .timeline-event-controls {
          display: flex;
          flex-shrink: 0;
          gap: 5px;
        }

        .timeline-event-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.2);
          color: #f5edd2;
          font-size: 18px;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease;
        }

        .timeline-event-button:hover:not(:disabled) {
          border-color: #d7b778;
          background: #d7b778;
          color: #21170f;
        }

        .timeline-event-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .timeline-event-button:focus-visible {
          outline: 2px solid #d7b778;
          outline-offset: 3px;
        }

        @media (max-width: 500px) {
          .timeline-event-card {
            align-items: flex-start;
            gap: 9px;
            padding: 12px;
          }

          .timeline-event-number {
            font-size: 19px;
          }

          .timeline-event-description {
            font-size: 13px;
          }

          .timeline-event-controls {
            gap: 4px;
          }

          .timeline-event-button {
            width: 30px;
            height: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .timeline-event-card,
          .timeline-event-button {
            transition: none;
          }
        }
      `}</style>

      <div className="timeline-event-card">
        <span className="timeline-event-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="timeline-event-details">
          <p className="timeline-event-time">{event.time}</p>
          <p className="timeline-event-description">
            {event.description}
          </p>
        </div>
        <div className="timeline-event-controls">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            aria-label="Move event earlier"
            className="timeline-event-button"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            aria-label="Move event later"
            className="timeline-event-button"
          >
            ↓
          </button>
        </div>
      </div>
    </>
  );
}