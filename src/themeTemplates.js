export const THEME_STORAGE_KEY = "wellness-tracker-theme";
export const DEFAULT_THEME = "ember";

export const themeTemplates = {
  ember: {
    label: "Ember",
    description: "Warm charcoal with orange energy accents.",
    tokens: {
      bg: "#0A0A0C",
      surface: "#131315",
      surface2: "#1A1A1E",
      border: "#1E1E22",
      text: "#F0EDE8",
      muted: "#77757A",
      dim: "#3A3A3E",
      orange: "#FF6B35",
      yellow: "#FFD93D",
      purple: "#C77DFF",
      teal: "#4ECDC4",
      green: "#2ECC71",
      blue: "#378ADD",
      red: "#E74C3C",
    },
  },
  graphite: {
    label: "Graphite",
    description: "Neutral black, silver and cool high-contrast accents.",
    tokens: {
      bg: "#0C0E11",
      surface: "#15181D",
      surface2: "#1D2229",
      border: "#2A3038",
      text: "#F5F7FA",
      muted: "#8B929D",
      dim: "#424954",
      orange: "#F59E5B",
      yellow: "#F4D35E",
      purple: "#A78BFA",
      teal: "#60D5C8",
      green: "#56D68A",
      blue: "#6CA7FF",
      red: "#F06A6A",
    },
  },
  ocean: {
    label: "Ocean",
    description: "Deep navy surfaces with blue and aqua highlights.",
    tokens: {
      bg: "#07111C",
      surface: "#0D1B2A",
      surface2: "#13263A",
      border: "#1E3850",
      text: "#EAF5FF",
      muted: "#7891A8",
      dim: "#2B4257",
      orange: "#FF8A5B",
      yellow: "#F4D35E",
      purple: "#B59CFF",
      teal: "#4DD9C7",
      green: "#45D483",
      blue: "#4C9AFF",
      red: "#FF6B6B",
    },
  },
  forest: {
    label: "Forest",
    description: "Dark green-black surfaces with natural recovery tones.",
    tokens: {
      bg: "#08110D",
      surface: "#0F1B15",
      surface2: "#17251D",
      border: "#263A2F",
      text: "#EFF8F1",
      muted: "#81978A",
      dim: "#3A5042",
      orange: "#F29D58",
      yellow: "#E7D46A",
      purple: "#B79AF0",
      teal: "#55CDB4",
      green: "#63D186",
      blue: "#69A7E8",
      red: "#E56B6F",
    },
  },
};

export function resolveThemeName(name) {
  return Object.prototype.hasOwnProperty.call(themeTemplates, name) ? name : DEFAULT_THEME;
}

export function getStoredThemeName() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    return resolveThemeName(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function storeThemeName(name) {
  const resolved = resolveThemeName(name);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, resolved);
    } catch {
      // Theme persistence is optional; the selected theme still applies for this session.
    }
  }
  return resolved;
}
