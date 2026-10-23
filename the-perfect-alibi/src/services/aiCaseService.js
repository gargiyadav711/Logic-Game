
import { cases } from "../data/cases.js";

export async function createMysteryCase(difficulty = "EASY") {
  const normalizedDifficulty = String(difficulty).toUpperCase();

  const selectedCase = cases.find(
    (item) =>
      String(item.difficulty).toUpperCase() === normalizedDifficulty
  );

  if (!selectedCase) {
    throw new Error(`No case found for difficulty: ${difficulty}`);
  }

  return JSON.parse(JSON.stringify(selectedCase));
}

export default createMysteryCase;
