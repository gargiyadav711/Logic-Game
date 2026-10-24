
import { scoreAttempt, validateStatement } from "./logicEngine.js";

export function validateFinalAccusation(caseData, attempt) {
  if (
    !caseData ||
    !attempt?.selectedSuspectId ||
    !String(attempt.explanation || "").trim()
  ) {
    throw new Error(
      "Choose a suspect and provide an evidence-backed explanation."
    );
  }

  return {
    ...scoreAttempt(caseData, attempt),
    mode: "Local Validation Mode",
  };
}

export function validateStatementChallenge(
  caseData,
  statementId,
  evidenceIds
) {
  return validateStatement(caseData, statementId, evidenceIds);
}
