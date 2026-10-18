
import React from "react";
import styled from "styled-components";
import { ArrowRight, Eye, Sparkles } from "lucide-react";

const CaseButton = ({ onClick, isActive = true }) => {
  return (
    <StyledWrapper>
      <button type="button" onClick={onClick} disabled={!isActive} className={`case-btn ${isActive ? "active" : "inactive"}`}>
        <span className="button-text">
          {isActive ? "OPEN CASE" : "SELECT CASE"}
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .case-btn {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-width: 190px;
    min-height: 52px;
    padding: 14px 22px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    border: 1px solid #c9a75c;
    border-radius: 2px;
    background: #e8ce83;
    color: #17120b;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    transition: color 350ms ease, border-color 350ms ease,
      box-shadow 350ms ease, transform 350ms ease;
  }

  .case-btn::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    background: linear-gradient(110deg, #f7e8ad, #c6a052, #f0d990);
    transform: translateX(-105%);
    transition: transform 450ms ease;
  }

  .case-btn.active:hover::before {
    transform: translateX(0);
  }

  .case-btn.active:hover {
    border-color: #fff0bd;
    box-shadow: 0 0 24px rgba(222, 187, 104, 0.2);
    transform: translateY(-2px);
  }

  .eye-icon,
  .arrow-icon {
    flex-shrink: 0;
    transition: transform 350ms ease;
  }

  .case-btn.active:hover .arrow-icon {
    transform: translateX(4px);
  }

  .case-btn.active:hover .eye-icon {
    transform: scale(1.12);
  }

  .case-btn.inactive {
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(0, 0, 0, 0.45);
    color: rgba(255, 255, 255, 0.4);
    cursor: default;
  }

  .case-btn.inactive::before {
    display: none;
  }

  @media (max-width: 480px) {
    .case-btn {
      min-width: 165px;
      padding: 12px 15px;
      gap: 9px;
    }
  }
`;

export default CaseButton;
