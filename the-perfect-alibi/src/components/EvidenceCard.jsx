export default function EvidenceCard({ evidence, checked, onChange }) {
  return (
    <>
      <style>{`
        .evidence-card {
          display: block;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.2);
          color: #f5edd2;
          cursor: pointer;
          transition:
            border-color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease;
        }

        .evidence-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.32);
        }

        .evidence-card:active {
          transform: scale(0.995);
        }

        .evidence-card-selected {
          border-color: #f5d98e;
          background: rgba(245, 217, 142, 0.1);
        }

        .evidence-card-selected:hover {
          border-color: #f5d98e;
          background: rgba(245, 217, 142, 0.14);
        }

        .evidence-card-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .evidence-checkbox {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          margin-top: 5px;
          accent-color: #f5d98e;
          cursor: pointer;
        }

        .evidence-card-text {
          display: block;
          min-width: 0;
        }

        .evidence-card-title {
          display: block;
          color: #f5edd2;
          font-family: "Bodoni Moda", Georgia, serif;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.4;
        }

        .evidence-card-detail {
          display: block;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.65);
          font-family: inherit;
          font-size: 14px;
          line-height: 1.7;
        }

        .evidence-card:focus-within {
          outline: 2px solid #d7b778;
          outline-offset: 3px;
        }

        .evidence-checkbox:focus-visible {
          outline: 2px solid #f5d98e;
          outline-offset: 3px;
        }

        @media (max-width: 600px) {
          .evidence-card {
            padding: 13px;
          }

          .evidence-card-title {
            font-size: 17px;
          }

          .evidence-card-detail {
            font-size: 13px;
            line-height: 1.6;
          }
        }
      `}</style>

      <label
        className={`evidence-card ${
          checked ? "evidence-card-selected" : ""
        }`}
      >
        <span className="evidence-card-content">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) =>
              onChange(evidence.id, event.target.checked)
            }
            className="evidence-checkbox"
          />

          <span className="evidence-card-text">
            <strong className="evidence-card-title">
              {evidence.title}
            </strong>

            <span className="evidence-card-detail">
              {evidence.detail}
            </span>
          </span>
        </span>
      </label>
    </>
  );
}