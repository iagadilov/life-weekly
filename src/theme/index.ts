/**
 * Main theme export
 * Combines all theme elements (colors, typography, spacing)
 */

import colors, { AccentColor, getCurrentAccent } from './colors';
import typography from './typography';
import spacing, { borderRadius, layout } from './spacing';

// Main theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
} as const;

// Re-export utilities
export type { AccentColor };
export { getCurrentAccent };

// Export individual modules for granular imports
export { colors, typography, spacing, borderRadius, layout };

export default theme;
