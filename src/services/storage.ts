/**
 * Storage Service
 * Handles all local data persistence using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeekEntry, STORAGE_KEYS } from '../types';

// ============================================================================
// User Profile Operations
// ============================================================================

/**
 * Save user profile to storage
 */
export const saveUserProfile = async (
  profile: UserProfile
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, jsonValue);
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile');
  }
};

/**
 * Get user profile from storage
 * Returns null if no profile exists
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
};

/**
 * Update user profile (partial update)
 */
export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const existingProfile = await getUserProfile();
    if (!existingProfile) {
      throw new Error('No existing profile to update');
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
    };

    await saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

// ============================================================================
// Week Entries Operations
// ============================================================================

/**
 * Save all week entries to storage
 * Internal function - use saveWeekEntry for single updates
 */
const saveAllWeekEntries = async (
  entries: Map<number, WeekEntry>
): Promise<void> => {
  try {
    // Convert Map to array for JSON serialization
    const entriesArray = Array.from(entries.entries());
    const jsonValue = JSON.stringify(entriesArray);
    await AsyncStorage.setItem(STORAGE_KEYS.WEEK_ENTRIES, jsonValue);
  } catch (error) {
    console.error('Error saving week entries:', error);
    throw new Error('Failed to save week entries');
  }
};

/**
 * Get all week entries from storage
 * Returns Map of weekNumber -> WeekEntry
 */
export const getAllWeekEntries = async (): Promise<Map<number, WeekEntry>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WEEK_ENTRIES);

    if (jsonValue == null) {
      return new Map();
    }

    const entriesArray: [number, WeekEntry][] = JSON.parse(jsonValue);
    return new Map(entriesArray);
  } catch (error) {
    console.error('Error getting week entries:', error);
    throw new Error('Failed to get week entries');
  }
};

/**
 * Save or update a single week entry
 */
export const saveWeekEntry = async (entry: WeekEntry): Promise<void> => {
  try {
    const allEntries = await getAllWeekEntries();
    allEntries.set(entry.weekNumber, entry);
    await saveAllWeekEntries(allEntries);
  } catch (error) {
    console.error('Error saving week entry:', error);
    throw new Error('Failed to save week entry');
  }
};

/**
 * Get a specific week entry by week number
 * Returns undefined if entry doesn't exist
 */
export const getWeekEntry = async (
  weekNumber: number
): Promise<WeekEntry | undefined> => {
  try {
    const allEntries = await getAllWeekEntries();
    return allEntries.get(weekNumber);
  } catch (error) {
    console.error('Error getting week entry:', error);
    throw new Error('Failed to get week entry');
  }
};

/**
 * Delete a specific week entry
 */
export const deleteWeekEntry = async (weekNumber: number): Promise<void> => {
  try {
    const allEntries = await getAllWeekEntries();
    allEntries.delete(weekNumber);
    await saveAllWeekEntries(allEntries);
  } catch (error) {
    console.error('Error deleting week entry:', error);
    throw new Error('Failed to delete week entry');
  }
};

/**
 * Check if a week entry exists
 */
export const hasWeekEntry = async (weekNumber: number): Promise<boolean> => {
  try {
    const allEntries = await getAllWeekEntries();
    return allEntries.has(weekNumber);
  } catch (error) {
    console.error('Error checking week entry:', error);
    return false;
  }
};

// ============================================================================
// Utility Operations
// ============================================================================

/**
 * Clear all application data
 * WARNING: This is destructive and cannot be undone
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.WEEK_ENTRIES,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Failed to clear all data');
  }
};

/**
 * Get storage info (for debugging/settings)
 */
export const getStorageInfo = async (): Promise<{
  profileExists: boolean;
  weekEntriesCount: number;
}> => {
  try {
    const profile = await getUserProfile();
    const entries = await getAllWeekEntries();

    return {
      profileExists: profile !== null,
      weekEntriesCount: entries.size,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    throw new Error('Failed to get storage info');
  }
};

/**
 * Export all data as JSON (for backup/debugging)
 */
export const exportData = async (): Promise<string> => {
  try {
    const profile = await getUserProfile();
    const entries = await getAllWeekEntries();

    const data = {
      profile,
      entries: Array.from(entries.entries()),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

// Export all functions as a service object
export const StorageService = {
  // User Profile
  saveUserProfile,
  getUserProfile,
  updateUserProfile,

  // Week Entries
  saveWeekEntry,
  getWeekEntry,
  getAllWeekEntries,
  deleteWeekEntry,
  hasWeekEntry,

  // Utility
  clearAllData,
  getStorageInfo,
  exportData,
};

export default StorageService;
