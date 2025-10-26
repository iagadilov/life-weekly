/**
 * Color palette for Life Weeks app
 * Following iOS design guidelines and minimalist aesthetic
 */

// Base colors - neutral grayscale
export const base = {
  background: '#FFFFFF',
  primaryText: '#000000',
  secondaryText: '#8E8E93',
  tertiaryText: '#C7C7CC',
} as const;

// Accent colors - user selectable
export const accents = {
  blue: '#007AFF',      // Default iOS blue
  purple: '#5856D6',    // iOS purple
  orange: '#FF9500',    // iOS orange
} as const;

// Week states - for grid visualization
export const weekStates = {
  past: '#34C759',          // iOS green for completed weeks
  current: '#A8E6CF',       // Light green for current week
  future: '#E8E8ED',        // Light gray for future weeks
} as const;

// UI elements - borders, cards, separators
export const ui = {
  border: '#E5E5EA',
  cardBackground: '#F9F9F9',
  separator: '#E5E5EA',
  success: '#34C759',       // iOS green
  error: '#FF3B30',         // iOS red
} as const;

// Type for accent color keys
export type AccentColor = keyof typeof accents;

// Helper function to get current accent color
export const getCurrentAccent = (accentKey: AccentColor = 'blue'): string => {
  return accents[accentKey];
};

// Export all colors as a single object
export const colors = {
  ...base,
  accents,
  weekStates,
  weekColors: weekStates, // Alias for convenience
  ui,
  // Additional convenient aliases
  border: ui.border,
  surface: ui.cardBackground,
} as const;

export default colors;
