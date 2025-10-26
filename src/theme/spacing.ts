/**
 * Spacing system for consistent layouts
 * Using 8pt grid system
 */

export const spacing = {
  xs: 4,    // Extra small - minimal gaps
  sm: 8,    // Small - compact spacing
  md: 16,   // Medium - default spacing
  lg: 24,   // Large - section spacing
  xl: 32,   // Extra large - screen padding
  xxl: 48,  // Extra extra large - major sections
} as const;

// Border radius values for different UI elements
export const borderRadius = {
  small: 6,     // Small elements (tags, badges)
  cell: 8,      // Week cells
  button: 10,   // Buttons, inputs
  card: 12,     // Cards, containers
} as const;

// Common layout values
export const layout = {
  screenPadding: spacing.m,        // Default screen horizontal padding
  sectionSpacing: spacing.l,       // Space between sections
  itemSpacing: spacing.s,          // Space between list items

  // Week grid specific
  weekCellSize: 8,                 // Size of each week cell
  weekCellGap: 2,                  // Gap between week cells
  yearLabelWidth: 32,              // Width for year labels

  // Touch targets (iOS HIG minimum)
  minTouchTarget: 44,              // Minimum tappable area
} as const;

export default spacing;
