import {
  DEFAULT_THEME,
  getStoredThemeName,
  resolveThemeName,
  storeThemeName,
  themeTemplates,
} from "./themeTemplates.js";

const initialThemeName = getStoredThemeName();

export const T = { ...themeTemplates[initialThemeName].tokens };

export const font = "'DM Sans', sans-serif";
export const display = "'Bebas Neue', sans-serif";

export { DEFAULT_THEME, themeTemplates };

export function applyTheme(name) {
  const resolved = resolveThemeName(name);
  Object.assign(T, themeTemplates[resolved].tokens);
  return resolved;
}

export function selectTheme(name) {
  const resolved = applyTheme(name);
  storeThemeName(resolved);
  return resolved;
}
