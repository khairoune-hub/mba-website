/** Admin label in the three admin UI languages (English falls back to French wording). */
export const L = (ar: string, fr: string, en = fr) => ({ ar, fr, en }) as Record<string, string>
