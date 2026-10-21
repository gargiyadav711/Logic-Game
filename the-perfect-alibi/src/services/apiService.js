const API_URL = import.meta.env.VITE_VALIDATION_API_URL?.trim();

export const isValidationApiConfigured = () => Boolean(API_URL);

export async function postValidation(payload) {
  if (!API_URL) return null;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Validation service returned HTTP ${response.status}.`);
  const data = await response.json();
  if (!data || typeof data.correct !== "boolean" || typeof data.score !== "number") {
    throw new Error("Validation service returned a malformed response.");
  }
  return data;
}
