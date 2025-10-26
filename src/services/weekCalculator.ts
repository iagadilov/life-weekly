/**
 * Week Calculator Service
 * Handles all date calculations and week generation logic
 */

import {
  addWeeksToDate,
  formatWeekRange,
  getCurrentDate,
  getWeekEnd,
  getWeeksBetween,
  getWeekStart,
  isSameWeekAs,
  toISOString,
} from '../utils/date';
import { Week, WeekStatus } from '../types';
import { CONSTANTS } from '../types';

/**
 * Calculate the number of weeks lived since birth
 */
export const getWeeksSinceBirth = (birthDate: Date): number => {
  const today = getCurrentDate();
  return getWeeksBetween(birthDate, today);
};

/**
 * Calculate total number of weeks in a lifespan
 */
export const getTotalWeeks = (lifeExpectancy: number): number => {
  return lifeExpectancy * CONSTANTS.WEEKS_PER_YEAR;
};

/**
 * Get the current week number (1-indexed)
 */
export const getCurrentWeekNumber = (birthDate: Date): number => {
  return getWeeksSinceBirth(birthDate) + 1; // 1-indexed
};

/**
 * Get start and end dates for a specific week number
 * Week 1 = the week when the person was born
 */
export const getWeekDates = (
  birthDate: Date,
  weekNumber: number
): { startDate: Date; endDate: Date } => {
  // Week 1 starts at birth week's Monday
  const birthWeekStart = getWeekStart(birthDate);

  // Calculate the start of the requested week (0-indexed for calculation)
  const weekStart = addWeeksToDate(birthWeekStart, weekNumber - 1);
  const weekEnd = getWeekEnd(weekStart);

  return {
    startDate: weekStart,
    endDate: weekEnd,
  };
};

/**
 * Determine if a week is past, current, or future
 */
export const getWeekStatus = (
  weekStart: Date,
  weekEnd: Date
): WeekStatus => {
  const today = getCurrentDate();

  if (isSameWeekAs(today, weekStart)) {
    return 'current';
  }

  if (today > weekEnd) {
    return 'past';
  }

  return 'future';
};

/**
 * Generate a single Week object
 */
export const generateWeek = (
  birthDate: Date,
  weekNumber: number,
  hasEntry: boolean = false
): Week => {
  const { startDate, endDate } = getWeekDates(birthDate, weekNumber);
  const status = getWeekStatus(startDate, endDate);

  return {
    weekNumber,
    startDate,
    endDate,
    status,
    hasEntry,
  };
};

/**
 * Generate all weeks from birth to expected lifespan
 * This is the main function used to create the life grid
 */
export const getAllWeeks = (
  birthDate: Date,
  lifeExpectancy: number,
  weekEntriesMap: Map<number, any> = new Map()
): Week[] => {
  const totalWeeks = getTotalWeeks(lifeExpectancy);
  const weeks: Week[] = [];

  for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
    const hasEntry = weekEntriesMap.has(weekNum);
    const week = generateWeek(birthDate, weekNum, hasEntry);
    weeks.push(week);
  }

  return weeks;
};

/**
 * Get all weeks for a specific year of life
 * Year 1 = first year of life (weeks 1-52)
 * Useful for future year view mode
 */
export const getWeeksInYear = (
  birthDate: Date,
  year: number,
  weekEntriesMap: Map<number, any> = new Map()
): Week[] => {
  const startWeek = (year - 1) * CONSTANTS.WEEKS_PER_YEAR + 1;
  const endWeek = year * CONSTANTS.WEEKS_PER_YEAR;
  const weeks: Week[] = [];

  for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
    const hasEntry = weekEntriesMap.has(weekNum);
    const week = generateWeek(birthDate, weekNum, hasEntry);
    weeks.push(week);
  }

  return weeks;
};

/**
 * Get weeks for a specific month
 * Useful for future month view mode
 */
export const getWeeksInMonth = (
  birthDate: Date,
  year: number,
  month: number,
  weekEntriesMap: Map<number, any> = new Map()
): Week[] => {
  const allWeeks = getAllWeeks(birthDate, 100, weekEntriesMap); // Max weeks
  const targetDate = new Date(year, month - 1, 1); // month is 0-indexed in Date

  // Filter weeks that overlap with this calendar month
  return allWeeks.filter(week => {
    const weekMonth = week.startDate.getMonth();
    const weekYear = week.startDate.getFullYear();
    return weekMonth === targetDate.getMonth() && weekYear === year;
  });
};

/**
 * Format week date range for display
 * Returns: "1 Jan - 7 Jan 2024"
 */
export const formatWeek = (week: Week): string => {
  return formatWeekRange(week.startDate, week.endDate);
};

/**
 * Get week by number
 */
export const getWeekByNumber = (
  birthDate: Date,
  weekNumber: number,
  hasEntry: boolean = false
): Week => {
  return generateWeek(birthDate, weekNumber, hasEntry);
};

/**
 * Calculate age in years from birth date
 */
export const getAgeInYears = (birthDate: Date): number => {
  const today = getCurrentDate();
  const ageInWeeks = getWeeksSinceBirth(birthDate);
  return Math.floor(ageInWeeks / CONSTANTS.WEEKS_PER_YEAR);
};

// Alias functions for backwards compatibility
export const calculateWeeksSinceBirth = getWeeksSinceBirth;
export const calculateAge = getAgeInYears;

/**
 * Get progress percentage of life lived
 */
export const getLifeProgress = (
  birthDate: Date,
  lifeExpectancy: number
): number => {
  const weeksSince = getWeeksSinceBirth(birthDate);
  const totalWeeks = getTotalWeeks(lifeExpectancy);
  return Math.min((weeksSince / totalWeeks) * 100, 100);
};

/**
 * Validate birth date
 * Returns error message if invalid, null if valid
 */
export const validateBirthDate = (dateString: string): string | null => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  const today = getCurrentDate();
  if (date > today) {
    return 'Birth date cannot be in the future';
  }

  if (date.getFullYear() < CONSTANTS.MIN_BIRTH_YEAR) {
    return `Birth year must be after ${CONSTANTS.MIN_BIRTH_YEAR}`;
  }

  return null;
};

// Export all functions as a service object
export const WeekCalculatorService = {
  getWeeksSinceBirth,
  getTotalWeeks,
  getCurrentWeekNumber,
  getWeekDates,
  getWeekStatus,
  generateWeek,
  getAllWeeks,
  getWeeksInYear,
  getWeeksInMonth,
  formatWeek,
  getWeekByNumber,
  getAgeInYears,
  getLifeProgress,
  validateBirthDate,
};

export default WeekCalculatorService;
