export const VALIDATION = {
  SUPPORTED: "supported",
  CONTRADICTED: "contradicted",
  UNRESOLVED: "unresolved"
};

export function validateStatement(caseData, statementId, selectedEvidenceIds = []) {
  const statement = caseData?.statements?.find((item) => item.id === statementId);
  if (!statement) return { status: VALIDATION.UNRESOLVED, feedback: "Statement not found.", evidenceIds: [] };

  const evidence = (caseData.evidence || []).filter((item) =>
    selectedEvidenceIds.includes(item.id) && statement.relatedEvidenceIds.includes(item.id)
  );

  if (!evidence.length) {
    return { status: VALIDATION.UNRESOLVED, feedback: "Select evidence specifically linked to this statement.", evidenceIds: [] };
  }

  // Case authors explicitly mark the expected rule result for each claim.
  // A result is only revealed after at least one related evidence item is selected.
  return {
    status: statement.expectedResult || VALIDATION.UNRESOLVED,
    feedback: {
      supported: "The selected evidence agrees with the statement.",
      contradicted: "The selected evidence conflicts with the statement.",
      unresolved: "The selected evidence is not sufficient to prove or disprove this statement."
    }[statement.expectedResult] || "The evidence is inconclusive.",
    evidenceIds: evidence.map((item) => item.id)
  };
}

export function validateTimeline(caseData, timelineOrder = []) {
  const expected = (caseData.timeline || []).slice().sort((a, b) => a.order - b.order).map((item) => item.id);
  const actual = timelineOrder.length ? timelineOrder : expected;
  const correctPositions = actual.filter((id, index) => expected[index] === id).length;
  return {
    correct: correctPositions === expected.length,
    correctPositions,
    total: expected.length,
    score: expected.length ? Math.round((correctPositions / expected.length) * 10) : 0,
    expectedOrder: expected
  };
}

export function scoreAttempt(caseData, attempt) {
  const weights = caseData.scoring || { culprit: 40, contradictions: 20, connections: 20, timeline: 10, explanation: 10 };
  const correctCulprit = attempt.selectedSuspectId === caseData.correctSuspectId;
  const contradictedIds = new Set(caseData.statements.filter((s) => s.expectedResult === "contradicted").map((s) => s.id));
  const challenged = new Set(attempt.challengedStatementIds || []);
  const contradictionPoints = contradictedIds.size
    ? Math.round(weights.contradictions * [...contradictedIds].filter((id) => challenged.has(id)).length / contradictedIds.size)
    : 0;
  const decisive = new Set(caseData.decisiveEvidenceIds || []);
  const selected = new Set(attempt.selectedEvidenceIds || []);
  const connectionPoints = decisive.size
    ? Math.round(weights.connections * [...decisive].filter((id) => selected.has(id)).length / decisive.size)
    : 0;
  const timeline = validateTimeline(caseData, attempt.timelineOrder || []);
  const explanationText = String(attempt.explanation || "").trim().toLowerCase();
  const explanationHasEvidence = (caseData.decisiveEvidenceIds || []).some((id) => {
    const item = caseData.evidence.find((e) => e.id === id);
    return item && (explanationText.includes(item.title.toLowerCase()) || explanationText.includes(id.toLowerCase()));
  });
  const explanationPoints = explanationText.length >= 30 && explanationHasEvidence ? weights.explanation : 0;
  const score = (correctCulprit ? weights.culprit : 0) + contradictionPoints + connectionPoints + Math.round(weights.timeline * timeline.score / 10) + explanationPoints;
  return {
    correct: correctCulprit,
    score: Math.min(100, score),
    breakdown: {
      culprit: correctCulprit ? weights.culprit : 0,
      contradictions: contradictionPoints,
      connections: connectionPoints,
      timeline: Math.round(weights.timeline * timeline.score / 10),
      explanation: explanationPoints
    },
    timelineCorrect: timeline.correct,
    explanationHasEvidence
  };
}

export function getUnlockState(progress) {
  return {
    "001": true,
    "002": Boolean(progress["001"]?.completed),
    "003": Boolean(progress["002"]?.completed)
  };
}
