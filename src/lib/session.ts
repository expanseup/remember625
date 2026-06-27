const SESSION_KEY = "remember625.anonymousSessionId";
const RUN_KEY = "remember625.currentQuizRunId";

function getOrCreate(key: string) {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

export function getAnonymousSessionId() {
  return getOrCreate(SESSION_KEY);
}

export function getOrCreateQuizRunId() {
  return getOrCreate(RUN_KEY);
}

export function clearQuizRunId() {
  if (typeof window !== "undefined") window.localStorage.removeItem(RUN_KEY);
}
