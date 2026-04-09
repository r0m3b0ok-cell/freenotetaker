export const getGroqKey = () =>
  localStorage.getItem('groq_api_key') ||
  (import.meta.env.VITE_GROQ_API_KEY as string) ||
  (() => { throw new Error('No Groq key') })();

export const setGroqKey = (k: string) =>
  localStorage.setItem('groq_api_key', k);

export const getOpenRouterKey = () =>
  localStorage.getItem('openrouter_api_key') ||
  (import.meta.env.VITE_OPENROUTER_API_KEY as string) ||
  (() => { throw new Error('No OpenRouter key') })();

export const setOpenRouterKey = (k: string) =>
  localStorage.setItem('openrouter_api_key', k);
