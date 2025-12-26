const STORAGE_KEY = "groq_api_key";

export const saveGroqApiKey = (key: string) => {
  if (typeof window === "undefined") return;
  const value = key.trim();
  if (!value) return;
  localStorage.setItem(STORAGE_KEY, value);
};

export const clearGroqApiKey = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

export const getGroqApiKey = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
};
