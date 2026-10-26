export const STORAGE_KEYS = {
  activeCase: "perfect-alibi-active-case",
  progress: "perfect-alibi-progress",
  caseProgress: (id) => `perfect-alibi-case-progress-${String(id).padStart(3, "0")}`,
  history: "perfect-alibi-game-history",
  settings: "perfect-alibi-settings"
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save ${key}`, error);
    return false;
  }
};

export function getProgress() {
  const saved = readJSON(STORAGE_KEYS.progress, {});
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
}

export function saveProgress(progress) {
  return writeJSON(STORAGE_KEYS.progress, progress);
}

export function getCaseProgress(id) {
  const value = readJSON(STORAGE_KEYS.caseProgress(id), null);
  if (value && typeof value === "object") return value;
  return {
    caseId: String(id),
    stage: "investigation",
    collectedEvidenceIds: [],
    evidenceConnections: [],
    timelineOrder: [],
    challengedStatementIds: [],
    selectedSuspectId: "",
    explanation: "",
    selectedEvidenceIds: [],
    completed: false,
    score: 0,
    attempts: 0,
    updatedAt: null
  };
}

export function saveCaseProgress(id, caseProgress) {
  const normalized = { ...caseProgress, caseId: String(id), updatedAt: new Date().toISOString() };
  writeJSON(STORAGE_KEYS.caseProgress(id), normalized);
  const all = getProgress();
  all[String(id)] = {
    completed: Boolean(normalized.completed),
    score: Number(normalized.score || 0),
    stage: normalized.stage || "investigation",
    updatedAt: normalized.updatedAt
  };
  saveProgress(all);
  return normalized;
}

export function getHistory() {
  const value = readJSON(STORAGE_KEYS.history, []);
  return Array.isArray(value) ? value : [];
}

export function saveAttempt(attempt) {
  const history = getHistory();
  if (!history.some((entry) => entry.attemptId === attempt.attemptId)) {
    //newest attempt appears first in the history
    history.unshift(attempt);
    writeJSON(STORAGE_KEYS.history, history);
  }
  return history;
}

export function getActiveCaseId() {
  try { return localStorage.getItem(STORAGE_KEYS.activeCase) || "001"; }
  catch { return "001"; }
}

export function setActiveCaseId(id) {
  try { localStorage.setItem(STORAGE_KEYS.activeCase, String(id)); }
  catch (error) { console.error("Could not save active case", error); }
}

export function resetProgress() {
  try {
    const keys = Object.values(STORAGE_KEYS);
    keys.forEach((key) => {
      if (typeof key === "string") localStorage.removeItem(key);
    });
    ["001", "002", "003"].forEach((id) => localStorage.removeItem(STORAGE_KEYS.caseProgress(id)));
    // Clean up keys used by the earlier dynamic-case implementation.
    ["current_active_case", "perfect-alibi-current-case", "perfect-alibi-selected-case"].forEach((key) => localStorage.removeItem(key));
    Object.keys(localStorage).filter((key) => key.startsWith("perfect-alibi-generated-case-")).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Could not reset game progress", error);
  }
}
