export const lightTheme = {
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb",
    tertiary: "#f3f4f6",
  },
  text: {
    primary: "#111827",
    secondary: "#4b5563",
    tertiary: "#6b7280",
    disabled: "#9ca3af",
  },
  border: {
    light: "#e5e7eb",
    default: "#d1d5db",
    dark: "#9ca3af",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

export const darkTheme = {
  background: {
    primary: "#111827",
    secondary: "#1f2937",
    tertiary: "#374151",
  },
  text: {
    primary: "#f9fafb",
    secondary: "#e5e7eb",
    tertiary: "#d1d5db",
    disabled: "#6b7280",
  },
  border: {
    light: "#4b5563",
    default: "#374151",
    dark: "#1f2937",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
  },
};

export type ThemeColors = typeof lightTheme;
