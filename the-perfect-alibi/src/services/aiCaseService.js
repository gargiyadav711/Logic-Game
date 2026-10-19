import { GoogleGenAI } from "@google/genai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
export async function createMysteryCase(difficulty = "Medium") {
    if (!ai) { throw new Error("Gemini API key is missing. Check your .env file."); }
    const prompt = `
Create one original detective mystery for a logic game called
"The Perfect Alibi".
Difficulty: ${difficulty}
Return ONLY valid JSON with this structure:
{
  "id": "generated-case",
  "title": "Case title",
  "difficulty": "${difficulty}",
  "incident": "Description of the crime",
  "briefing": "Instructions for the investigator",
  "victim": {
    "name": "Victim name",
    "description": "Victim background"
  },
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue title",
      "description": "What was discovered",
      "timestamp": "20:15",
      "reliability": "verified"
    }
  ],
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Suspect name",
      "motive": "Possible motive",
      "alibi": "Claimed whereabouts",
      "statements": [
        {
          "id": "statement-1",
          "text": "A specific claim",
          "timestamp": "20:00"
        }
      ]
    }
  ],
  "timeline": [
    {
      "id": "event-1",
      "time": "20:00",
      "description": "Event description"
    }
  ],
  "answer": "suspect-1",
  "explanation": "Step-by-step reasoning proving the solution",
  "hint": "A useful hint"
}

Requirements:
- Include exactly 4 clues and 3 suspects.
- Give every suspect a motive, alibi, and at least 2 statements.
- Include at least one misleading statement and multiple contradictions.
- Make the timeline consistent with verified evidence.
- Ensure exactly one suspect is logically identifiable as the culprit.
- The solution must be supported by specific clues and statements.
- Avoid contradictions in the official evidence itself.
- Use unique IDs and valid JSON only.
`;
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.4,
        },
    });
    const text = response.text;
    if (!text) {
        throw new Error("The AI returned an empty case.");
    }
    let mysteryCase;
    try {
        mysteryCase = JSON.parse(text);
    } catch {
        throw new Error("The AI returned invalid JSON. Please try again.");
    }
    validateMysteryCase(mysteryCase);
    const caseId = crypto.randomUUID();
    return {
        ...mysteryCase,
        id: caseId,
        createdAt: new Date().toISOString(),
    };
}
function validateMysteryCase(data) {
    if (
        !data ||
        typeof data.title !== "string" ||
        !Array.isArray(data.clues) ||
        data.clues.length !== 4 ||
        !Array.isArray(data.suspects) ||
        data.suspects.length !== 3 ||
        !Array.isArray(data.timeline) ||
        typeof data.answer !== "string" ||
        !data.explanation
    ) {
        throw new Error("The generated case does not match the required structure.");
    }
    const suspectIds = data.suspects.map((suspect) => String(suspect.id));
    if (
        new Set(suspectIds).size !== suspectIds.length ||
        !suspectIds.includes(String(data.answer))
    ) {
        throw new Error("The generated case has invalid suspect IDs or answer.");
    }
    const clueIds = data.clues.map((clue) => String(clue.id));
    if (new Set(clueIds).size !== clueIds.length) {
        throw new Error("The generated case contains duplicate clue IDs.");
    }
    for (const suspect of data.suspects) {
        if (
            !suspect.id ||
            !suspect.name ||
            !suspect.motive ||
            !suspect.alibi ||
            !Array.isArray(suspect.statements) ||
            suspect.statements.length < 2
        ) {
            throw new Error("A suspect is missing required information.");
        }
    }
}
