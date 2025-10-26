/**
 * App Context
 * Global state management using React Context API
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  UserProfile,
  WeekEntry,
  Todo,
  AppContextValue,
  Week,
} from '../types';
import {
  saveUserProfile as saveProfileToStorage,
  getUserProfile as getProfileFromStorage,
  saveWeekEntry as saveWeekEntryToStorage,
  getAllWeekEntries as getAllEntriesFromStorage,
  deleteWeekEntry as deleteWeekEntryFromStorage,
  clearAllData as clearStorageData,
} from '../services/storage';
import {
  getAllWeeks,
  getCurrentWeekNumber,
} from '../services/weekCalculator';
import { toISOString, getCurrentDate } from '../utils/date';

// ============================================================================
// Context Creation
// ============================================================================

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weekEntries, setWeekEntries] = useState<Map<number, WeekEntry>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Derived state - calculate weeks based on profile
  const weeks = useMemo<Week[]>(() => {
    if (!userProfile) return [];

    const birthDate = new Date(userProfile.dateOfBirth);
    return getAllWeeks(birthDate, userProfile.lifeExpectancy, weekEntries);
  }, [userProfile, weekEntries]);

  // Current week number
  const currentWeekNumber = useMemo<number>(() => {
    if (!userProfile) return 0;

    const birthDate = new Date(userProfile.dateOfBirth);
    return getCurrentWeekNumber(birthDate);
  }, [userProfile]);

  // ============================================================================
  // Initialization - Load data from storage
  // ============================================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profile, entries] = await Promise.all([
          getProfileFromStorage(),
          getAllEntriesFromStorage(),
        ]);

        setUserProfile(profile);
        setWeekEntries(entries);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================================================================
  // User Profile Actions
  // ============================================================================

  const saveUserProfile = useCallback(async (profile: UserProfile) => {
    try {
      await saveProfileToStorage(profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!userProfile) {
        throw new Error('No user profile to update');
      }

      try {
        const updatedProfile: UserProfile = {
          ...userProfile,
          ...updates,
        };
        await saveProfileToStorage(updatedProfile);
        setUserProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    },
    [userProfile]
  );

  // ============================================================================
  // Week Entry Actions
  // ============================================================================

  const saveWeekEntry = useCallback(async (entry: WeekEntry) => {
    try {
      await saveWeekEntryToStorage(entry);
      setWeekEntries(prev => new Map(prev).set(entry.weekNumber, entry));
    } catch (error) {
      console.error('Error saving week entry:', error);
      throw error;
    }
  }, []);

  const getWeekEntry = useCallback(
    (weekNumber: number): WeekEntry | undefined => {
      return weekEntries.get(weekNumber);
    },
    [weekEntries]
  );

  const deleteWeekEntry = useCallback(async (weekNumber: number) => {
    try {
      await deleteWeekEntryFromStorage(weekNumber);
      setWeekEntries(prev => {
        const newMap = new Map(prev);
        newMap.delete(weekNumber);
        return newMap;
      });
    } catch (error) {
      console.error('Error deleting week entry:', error);
      throw error;
    }
  }, []);

  // ============================================================================
  // Todo Actions (Helper methods)
  // ============================================================================

  const addTodo = useCallback(
    async (weekNumber: number, text: string) => {
      try {
        const existingEntry = weekEntries.get(weekNumber);
        const now = toISOString(getCurrentDate());

        const newTodo: Todo = {
          id: uuidv4(),
          text,
          completed: false,
          createdAt: now,
        };

        if (existingEntry) {
          // Update existing entry
          const updatedEntry: WeekEntry = {
            ...existingEntry,
            todos: [...existingEntry.todos, newTodo],
            updatedAt: now,
          };
          await saveWeekEntry(updatedEntry);
        } else {
          // Create new entry
          if (!userProfile) {
            throw new Error('No user profile found');
          }

          const birthDate = new Date(userProfile.dateOfBirth);
          const { getWeekDates } = await import('../services/weekCalculator');
          const { startDate, endDate } = getWeekDates(birthDate, weekNumber);

          const newEntry: WeekEntry = {
            id: uuidv4(),
            weekNumber,
            startDate: toISOString(startDate),
            endDate: toISOString(endDate),
            journal: '',
            todos: [newTodo],
            createdAt: now,
            updatedAt: now,
          };
          await saveWeekEntry(newEntry);
        }
      } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
      }
    },
    [weekEntries, userProfile, saveWeekEntry]
  );

  const toggleTodo = useCallback(
    async (weekNumber: number, todoId: string) => {
      try {
        const entry = weekEntries.get(weekNumber);
        if (!entry) {
          throw new Error('Week entry not found');
        }

        const now = toISOString(getCurrentDate());
        const updatedTodos = entry.todos.map(todo =>
          todo.id === todoId
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? now : undefined,
              }
            : todo
        );

        const updatedEntry: WeekEntry = {
          ...entry,
          todos: updatedTodos,
          updatedAt: now,
        };

        await saveWeekEntry(updatedEntry);
      } catch (error) {
        console.error('Error toggling todo:', error);
        throw error;
      }
    },
    [weekEntries, saveWeekEntry]
  );

  const deleteTodo = useCallback(
    async (weekNumber: number, todoId: string) => {
      try {
        const entry = weekEntries.get(weekNumber);
        if (!entry) {
          throw new Error('Week entry not found');
        }

        const now = toISOString(getCurrentDate());
        const updatedTodos = entry.todos.filter(todo => todo.id !== todoId);

        const updatedEntry: WeekEntry = {
          ...entry,
          todos: updatedTodos,
          updatedAt: now,
        };

        await saveWeekEntry(updatedEntry);
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
    },
    [weekEntries, saveWeekEntry]
  );

  // ============================================================================
  // Journal Actions
  // ============================================================================

  const updateJournal = useCallback(
    async (weekNumber: number, journal: string) => {
      try {
        const existingEntry = weekEntries.get(weekNumber);
        const now = toISOString(getCurrentDate());

        if (existingEntry) {
          // Update existing entry
          const updatedEntry: WeekEntry = {
            ...existingEntry,
            journal,
            updatedAt: now,
          };
          await saveWeekEntry(updatedEntry);
        } else {
          // Create new entry
          if (!userProfile) {
            throw new Error('No user profile found');
          }

          const birthDate = new Date(userProfile.dateOfBirth);
          const { getWeekDates } = await import('../services/weekCalculator');
          const { startDate, endDate } = getWeekDates(birthDate, weekNumber);

          const newEntry: WeekEntry = {
            id: uuidv4(),
            weekNumber,
            startDate: toISOString(startDate),
            endDate: toISOString(endDate),
            journal,
            todos: [],
            createdAt: now,
            updatedAt: now,
          };
          await saveWeekEntry(newEntry);
        }
      } catch (error) {
        console.error('Error updating journal:', error);
        throw error;
      }
    },
    [weekEntries, userProfile, saveWeekEntry]
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearAllData = useCallback(async () => {
    try {
      await clearStorageData();
      setUserProfile(null);
      setWeekEntries(new Map());
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profile, entries] = await Promise.all([
        getProfileFromStorage(),
        getAllEntriesFromStorage(),
      ]);

      setUserProfile(profile);
      setWeekEntries(entries);
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: AppContextValue = {
    // State
    userProfile,
    weekEntries,
    weeks,
    currentWeekNumber,
    isLoading,

    // Actions
    saveUserProfile,
    updateUserProfile,
    saveWeekEntry,
    getWeekEntry,
    deleteWeekEntry,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateJournal,
    clearAllData,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ============================================================================
// Hook for consuming context
// ============================================================================

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
