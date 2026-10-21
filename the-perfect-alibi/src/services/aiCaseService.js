
const cases = [
  {
    id: "case-001",
    title: "The Perfect Alibi",
    difficulty: "EASY",
    description: "A mysterious crime with a seemingly perfect alibi.",
    suspects: [
      { id: "suspect-01", name: "Alexander Black" },
      { id: "suspect-02", name: "Victoria Sterling" },
      { id: "suspect-03", name: "James Carter" },
    ],
    evidence: [
      {
        id: "evidence-01",
        title: "The Broken Clock",
        description: "The clock stopped at 9:15 PM.",
      },
      {
        id: "evidence-02",
        title: "The Witness Statement",
        description: "A witness saw someone near the room at 9:30 PM.",
      },
    ],
    solution: {
      culpritId: "suspect-02",
      explanation:
        "Victoria Sterling is the culprit. Compare the witness statement with the timeline to uncover the contradiction.",
    },
  },
  {
    id: "case-002",
    title: "The Missing Evidence",
    difficulty: "MEDIUM",
    description: "A crucial piece of evidence has disappeared.",
    suspects: [
      { id: "suspect-01", name: "Daniel Reed" },
      { id: "suspect-02", name: "Olivia Hayes" },
      { id: "suspect-03", name: "Michael Stone" },
    ],
    evidence: [
      {
        id: "evidence-01",
        title: "The Empty Cabinet",
        description: "The evidence cabinet was opened after closing time.",
      },
      {
        id: "evidence-02",
        title: "The Security Log",
        description: "One access entry conflicts with a suspect's alibi.",
      },
    ],
    solution: {
      culpritId: "suspect-03",
      explanation:
        "Michael Stone is responsible. The access log contradicts his alibi.",
    },
  },
  {
    id: "case-003",
    title: "The Final Suspect",
    difficulty: "HARD",
    description: "A complicated case with conflicting accounts.",
    suspects: [
      { id: "suspect-01", name: "Eleanor Hayes" },
      { id: "suspect-02", name: "Robert Wells" },
      { id: "suspect-03", name: "Sophia Bennett" },
    ],
    evidence: [
      {
        id: "evidence-01",
        title: "The Torn Letter",
        description: "A letter reveals a disagreement before the crime.",
      },
      {
        id: "evidence-02",
        title: "The Timeline",
        description: "The reported movements do not match the available timeline.",
      },
    ],
    solution: {
      culpritId: "suspect-01",
      explanation:
        "Eleanor Hayes is the culprit. Her timeline conflicts with the evidence.",
    },
  },
];

export async function createMysteryCase(difficulty = "EASY") {
  const normalizedDifficulty = String(difficulty).toUpperCase();

  const selectedCase =
    cases.find((item) => item.difficulty === normalizedDifficulty) ??
    cases[0];

  // Return a copy so changes to a case do not modify the source data.
  return JSON.parse(JSON.stringify(selectedCase));
}

export default createMysteryCase;
