/**
 * Application configuration constants
 */

export const CONFIG = {
  // App info
  APP_NAME: 'Life Weeks',
  VERSION: '1.0.0',

  // Date/Time
  WEEKS_PER_YEAR: 52,
  DAYS_PER_WEEK: 7,

  // Defaults
  DEFAULT_LIFE_EXPECTANCY: 80,
  MIN_LIFE_EXPECTANCY: 60,
  MAX_LIFE_EXPECTANCY: 100,
  MIN_BIRTH_YEAR: 1900,
  DEFAULT_ACCENT_COLOR: 'blue' as const,

  // Auto-save
  JOURNAL_AUTOSAVE_DELAY: 2000, // 2 seconds debounce

  // Animation durations (ms)
  ANIMATION: {
    QUICK: 200,
    NORMAL: 300,
    SLOW: 500,
    PULSE_CYCLE: 2000,
  },

  // Haptic feedback settings
  HAPTICS: {
    ENABLED_BY_DEFAULT: true,
  },
} as const;

export default CONFIG;
