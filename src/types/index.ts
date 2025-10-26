/**
 * TypeScript type definitions for Life Weeks app
 */

import { AccentColor } from '../theme/colors';

// ============================================================================
// User Profile
// ============================================================================

export interface UserProfile {
  dateOfBirth: string;              // ISO date string
  lifeExpectancy: number;           // Expected lifespan in years (default: 80)
  accentColor: AccentColor;         // Selected accent color
  onboardingCompleted: boolean;     // Has user completed onboarding?
  createdAt: string;                // ISO date string
}

// ============================================================================
// Week Data
// ============================================================================

export interface Todo {
  id: string;                       // UUID
  text: string;                     // Todo text content
  completed: boolean;               // Is todo completed?
  createdAt: string;                // ISO date string
  completedAt?: string;             // ISO date string (optional)
}

export interface WeekEntry {
  id: string;                       // UUID
  weekNumber: number;               // Week number since birth (1-indexed)
  startDate: string;                // ISO date string - Monday
  endDate: string;                  // ISO date string - Sunday
  journal: string;                  // Journal entry text
  mood?: number;                    // Mood rating 1-5 (optional, for future)
  todos: Todo[];                    // Array of todos for this week
  createdAt: string;                // ISO date string
  updatedAt: string;                // ISO date string
}

// ============================================================================
// Week Calculation
// ============================================================================

export type WeekStatus = 'past' | 'current' | 'future';

export interface Week {
  weekNumber: number;               // Week number since birth (1-indexed)
  startDate: Date;                  // Monday of the week
  endDate: Date;                    // Sunday of the week
  status: WeekStatus;               // Is this week past, current, or future?
  hasEntry: boolean;                // Does this week have saved data?
}

// ============================================================================
// View Modes (for future versions)
// ============================================================================

export type ViewMode = 'life' | 'year' | 'month';

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  Onboarding: undefined;
  LifeGrid: undefined;
  WeekDetail: {
    weekNumber: number;
    week: Week;
  };
  CurrentWeek: undefined;
  Settings: undefined;
};

// ============================================================================
// Context State
// ============================================================================

export interface AppState {
  userProfile: UserProfile | null;
  weekEntries: Map<number, WeekEntry>;  // Map of weekNumber -> WeekEntry
  weeks: Week[];                        // All weeks calculated from birth to lifeExpectancy
  currentWeekNumber: number;            // Current week number
  isLoading: boolean;
}

export interface AppContextValue extends AppState {
  // User Profile actions
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Week Entry actions
  saveWeekEntry: (entry: WeekEntry) => Promise<void>;
  getWeekEntry: (weekNumber: number) => WeekEntry | undefined;
  deleteWeekEntry: (weekNumber: number) => Promise<void>;

  // Todo actions
  addTodo: (weekNumber: number, text: string) => Promise<void>;
  toggleTodo: (weekNumber: number, todoId: string) => Promise<void>;
  deleteTodo: (weekNumber: number, todoId: string) => Promise<void>;

  // Journal actions
  updateJournal: (weekNumber: number, journal: string) => Promise<void>;

  // Utility actions
  clearAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  USER_PROFILE: '@life_weeks:user_profile',
  WEEK_ENTRIES: '@life_weeks:week_entries',
} as const;

// ============================================================================
// Constants
// ============================================================================

export const CONSTANTS = {
  WEEKS_PER_YEAR: 52,
  DEFAULT_LIFE_EXPECTANCY: 80,
  MIN_LIFE_EXPECTANCY: 60,
  MAX_LIFE_EXPECTANCY: 100,
  MIN_BIRTH_YEAR: 1900,
} as const;
