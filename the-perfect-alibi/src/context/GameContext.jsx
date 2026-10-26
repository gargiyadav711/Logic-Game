import { createContext, useCallback,useContext, useEffect, useMemo,useState,} from "react";
import { cases, getCaseById } from "../data/cases.js";
import {getActiveCaseId,getCaseProgress,getProgress,saveCaseProgress,setActiveCaseId,} from "../services/storageService.js";
import { getUnlockState } from "../services/logicEngine.js";
const GameContext = createContext(null);
function getInitialCaseId() {
  try {
    const savedCase = localStorage.getItem("current_active_case");
    if (savedCase) {
      const parsedCase = JSON.parse(savedCase);
      //for getting the saved game
      const selectedId = String(parsedCase.selectedCaseId ?? parsedCase.id ?? "");
      if (getCaseById(selectedId)) {
        return selectedId;
      }
    }
  } catch (error) {
    console.error("Error reading the active case:", error);
  }
  // to get thr active case data
  const storedId = String(getActiveCaseId() ?? "");
  if (getCaseById(storedId)) {
    return storedId;
  }
  return cases[0]?.id ?? null;
}

export function GameProvider({ children }) {
  const [activeCaseId, setActiveId] = useState(getInitialCaseId);
  const [progress, setProgress] = useState(getProgress);
  const [caseProgress, setCaseProgress] = useState(() =>
    getCaseProgress(getInitialCaseId())
  );
  useEffect(() => {
    if (!activeCaseId) return;
    setActiveCaseId(activeCaseId);
    setCaseProgress(getCaseProgress(activeCaseId));
  }, [activeCaseId]);

  const activateCase = useCallback((id) => {
    const normalizedId = String(id);
    const target = getCaseById(normalizedId);

    if (!target) {
      console.error("Unknown case ID:", normalizedId);
      return false;
    }

    setActiveId(normalizedId);
    setActiveCaseId(normalizedId);
    setCaseProgress(getCaseProgress(normalizedId));

    return true;
  }, []);
  const selectCase = useCallback(
    (id) => {
      const normalizedId = String(id);
      const target = getCaseById(normalizedId);
      if (!target) {throw new Error(`Unknown case ID: ${normalizedId}`);}
      const unlocks = getUnlockState(progress);
      if (!unlocks[normalizedId]) {
        throw new Error("This case is locked. Complete the previous case first.");
      }
      setActiveId(normalizedId);
      setActiveCaseId(normalizedId);
      setCaseProgress(getCaseProgress(normalizedId));
    },
    [progress]
  );

  // Save progress for the currently active case.
  const updateCaseProgress = useCallback(
    (patch) => {
      setCaseProgress((previous) => {
        const next = saveCaseProgress(activeCaseId, {...previous,...patch,});
        setProgress(getProgress());
        return next;
      });
    },
    [activeCaseId]
  );
  // Always resolve the active case from the canonical case data.
  const activeCase = useMemo(
    () => getCaseById(activeCaseId),
    [activeCaseId]
  );

  const refreshProgress = useCallback(() => {
    setProgress(getProgress());
  }, []);

  const value = useMemo(
    () => ({cases,activeCase,activeCaseId,caseProgress,progress,selectCase,activateCase,updateCaseProgress,refreshProgress,}),
    [
      activeCase,
      activeCaseId,
      caseProgress,
      progress,
      selectCase,
      activateCase,
      updateCaseProgress,
      refreshProgress,
    ]
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {throw new Error("useGame must be used within GameProvider.");}
  return context;
}
