import { useState } from "react";
const suspectImages = [
  "/suspect1.jpeg",
  "/suspect2.jpeg",
  "/suspect3.jpeg",
];
export default function SuspectCard({suspect,selected,onSelect,index = 0,})
{
  const [imageFailed, setImageFailed] = useState(false);
  const imagePath = suspectImages[index] || `/suspect${index + 1}.jpg`;
  return (
  <article className={`suspect-card ${selected ? "suspect-card-selected" : ""}`}>
    <div className="suspect-card-layout">
      <div className="suspect-portrait">
        {!imageFailed ? (
          <img src={imagePath} alt={suspect.name}onError={() => setImageFailed(true)}/>
        ) : (
          <div className="suspect-image-placeholder">
            {suspect.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <span className="suspect-portrait-frame" />
      </div>
      <div className="suspect-info">
        <div className="suspect-card-header">
          <div className="suspect-identity">
            <p className="suspect-role">{suspect.role}</p>
            <h3 className="suspect-name">{suspect.name}</h3>
            <span className="suspect-file-label">
              PERSON OF INTEREST
            </span>
          </div>

          <button type="button" onClick={() => onSelect?.(suspect.id)} className={`suspect-select-button ${
              selected ? "suspect-select-button-active" : ""}`}
            aria-pressed={selected}>
            {selected ? "SELECTED" : "SELECT"}
          </button>
        </div>
        <div className="suspect-card-divider" />
        <div className="suspect-detail">
          <strong>Motive</strong>
          <p>{suspect.motive || "No motive recorded."}</p>
        </div>
        <div className="suspect-detail">
          <strong>Alibi</strong>
          <p>{suspect.alibi || "No alibi recorded."}</p>
        </div>
        <blockquote className="suspect-statement">
          “{suspect.statement || "No statement recorded."}”
        </blockquote>
        {selected && (
          <div className="suspect-selected-note">
            SUSPECT SELECTED FOR INVESTIGATION
          </div>
        )}
      </div>
    </div>
    <style>{`
      .suspect-card {
        box-sizing: border-box;
        width: 100%;
        padding: 20px;
        color: #f2e8d0;
        background: rgba(14, 11, 8, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.15);
        transition: border-color 0.25s ease, background 0.25s ease;
      }

      .suspect-card:hover {
        border-color: rgba(215, 183, 120, 0.5);
        background: rgba(27, 20, 13, 0.9);
      }

      .suspect-card-selected {
        border-color: #d7b778;
        background: rgba(190, 150, 89, 0.12);
      }

      .suspect-card-layout {
        display: flex;
        align-items: flex-start;
        gap: 24px;
        width: 100%;
      }

      .suspect-portrait {
        position: relative;
        flex: 0 0 190px;
        width: 300px;
        height: 300px;
        overflow: hidden;
        background: #2a2117;
        border: 1px solid rgba(215, 183, 120, 0.5);
      }

      .suspect-portrait img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: sepia(18%) brightness(0.88);
      }

      .suspect-portrait-frame {
        position: absolute;
        inset: 7px;
        border: 1px solid rgba(245, 226, 189, 0.3);
        pointer-events: none;
      }

      .suspect-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #d7b778;
        font-family: "Bodoni Moda", Georgia, serif;
        font-size: 52px;
        background: #211910;
      }

      /* Right information */
      .suspect-info {
        flex: 1;
        min-width: 0;
      }

      .suspect-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
      }

      .suspect-identity {
        flex: 1;
        min-width: 0;
      }

      .suspect-role {
        margin: 0;
        color: #d7b778;
        font-size: 10px;
        letter-spacing: 1.8px;
        text-transform: uppercase;
      }

      .suspect-name {
        margin: 7px 0;
        color: #f5eddc;
        font-family: "Bodoni Moda", Georgia, serif;
        font-size: 27px;
        font-weight: 500;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }

      .suspect-file-label {
        color: #a99573;
        font-size: 9px;
        letter-spacing: 1.2px;
      }

      .suspect-select-button {
        flex-shrink: 0;
        padding: 8px 12px;
        color: #e7d3ad;
        background: transparent;
        border: 1px solid rgba(215, 183, 120, 0.4);
        font-family: inherit;
        font-size: 9px;
        letter-spacing: 1px;
        cursor: pointer;
      }

      .suspect-select-button:hover,
      .suspect-select-button-active {
        color: #21180e;
        background: #d7b778;
        border-color: #d7b778;
      }

      .suspect-card-divider {
        height: 1px;
        margin: 16px 0;
        background: rgba(215, 183, 120, 0.25);
      }

      .suspect-detail {
        margin-top: 12px;
      }

      .suspect-detail strong {
        display: block;
        margin-bottom: 5px;
        color: #e7cb94;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .suspect-detail p {
        margin: 0;
        color: rgba(245, 237, 220, 0.78);
        font-size: 13px;
        line-height: 1.7;
        overflow-wrap: anywhere;
      }

      .suspect-statement {
        margin: 16px 0 0;
        padding: 10px 13px;
        color: rgba(245, 237, 220, 0.72);
        background: rgba(0, 0, 0, 0.2);
        font-family: "Bodoni Moda", Georgia, serif;
        font-size: 14px;
        font-style: italic;
        line-height: 1.7;
        overflow-wrap: anywhere;
      }

      .suspect-selected-note {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 14px;
        padding-top: 10px;
        color: #d7b778;
        border-top: 1px solid rgba(215, 183, 120, 0.2);
        font-size: 9px;
        letter-spacing: 1px;
      }
      @media (max-width: 600px) {
        .suspect-card-layout {
          flex-direction: column;
          gap: 18px;
        }

        .suspect-portrait {
          width: 100%;
          height: 240px;
          flex-basis: auto;
        }

        .suspect-name {
          font-size: 23px;
        }
      }
    `}</style>
  </article>
);
}