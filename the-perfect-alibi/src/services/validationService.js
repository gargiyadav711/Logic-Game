import { isValidationApiConfigured, postValidation } from "./apiService.js";
import { scoreAttempt } from "./logicEngine.js";

export async function validateFinalAccusation(caseData, attempt) {
  if (!caseData || !attempt?.selectedSuspectId || !String(attempt.explanation || "").trim()) {
    throw new Error("Choose a suspect and provide an evidence-backed explanation.");
  }
  if (isValidationApiConfigured()) {
    try {
      const apiResult = await postValidation({
        caseId: caseData.id,
        selectedSuspectId: attempt.selectedSuspectId,
        explanation: attempt.explanation,
        evidenceIds: attempt.selectedEvidenceIds || [],
        challengedStatementIds: attempt.challengedStatementIds || [],
        timelineOrder: attempt.timelineOrder || []
      });
      return { ...apiResult, mode: "API Validation Mode" };
    } catch (error) {
      // Do not silently turn an API error into a locally-correct answer.
      throw new Error(`API validation failed: ${error.message} Local Validation Mode is available after clearing VITE_VALIDATION_API_URL.`);
    }
  }
  return { ...scoreAttempt(caseData, attempt), mode: "Local Validation Mode" };
}

export async function validateStatementChallenge(caseData, statementId, evidenceIds) {
  const { validateStatement } = await import("./logicEngine.js");
  return validateStatement(caseData, statementId, evidenceIds);
}
