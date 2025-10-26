/**
 * Haptic feedback utilities
 * Provides tactile feedback for user interactions
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Light impact - for toggles, checkbox
 */
export const lightImpact = (): void => {
  ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
};

/**
 * Medium impact - for selections
 */
export const mediumImpact = (): void => {
  ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
};

/**
 * Heavy impact - for important actions
 */
export const heavyImpact = (): void => {
  ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
};

/**
 * Selection feedback - for picker changes
 */
export const selection = (): void => {
  ReactNativeHapticFeedback.trigger('selection', hapticOptions);
};

/**
 * Success notification - for task completion
 */
export const notificationSuccess = (): void => {
  ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
};

/**
 * Warning notification - for deletions
 */
export const notificationWarning = (): void => {
  ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
};

/**
 * Error notification - for errors
 */
export const notificationError = (): void => {
  ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
};

// Export a single object with all haptic functions
export const haptics = {
  light: lightImpact,
  medium: mediumImpact,
  heavy: heavyImpact,
  selection,
  success: notificationSuccess,
  warning: notificationWarning,
  error: notificationError,
} as const;

export default haptics;
