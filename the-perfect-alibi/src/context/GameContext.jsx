import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cases, getCaseById } from "../data/cases.js";
import { getActiveCaseId, getCaseProgress, getProgress, saveCaseProgress, setActiveCaseId } from "../services/storageService.js";
import { getUnlockState } from "../services/logicEngine.js";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [activeCaseId, setActiveId] = useState(getActiveCaseId);
  const [progress, setProgress] = useState(getProgress);
  const [caseProgress, setCaseProgress] = useState(() => getCaseProgress(getActiveCaseId()));

  useEffect(() => {
    setActiveCaseId(activeCaseId);
    setCaseProgress(getCaseProgress(activeCaseId));
  }, [activeCaseId]);

  const selectCase = useCallback((id) => {
    const target = getCaseById(id);
    if (!target) throw new Error("Unknown case ID.");
    const unlocks = getUnlockState(progress);
    if (!unlocks[id]) throw new Error("This case is locked. Complete the previous case first.");
    setActiveId(id);
    setActiveCaseId(id);
    setCaseProgress(getCaseProgress(id));
  }, [progress]);

  const updateCaseProgress = useCallback((patch) => {
    setCaseProgress((previous) => {
      const next = saveCaseProgress(activeCaseId, { ...previous, ...patch });
      setProgress(getProgress());
      return next;
    });
  }, [activeCaseId]);

  const activeCase = useMemo(() => getCaseById(activeCaseId), [activeCaseId]);
  const value = useMemo(() => ({
    cases, activeCase, activeCaseId, caseProgress, progress, selectCase, updateCaseProgress,
    refreshProgress: () => setProgress(getProgress())
  }), [activeCase, activeCaseId, caseProgress, progress, selectCase, updateCaseProgress]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider.");
  return context;
}
