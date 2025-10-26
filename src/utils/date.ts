/**
 * Date utility functions
 * Using date-fns for date manipulation
 */

import {
  format,
  startOfWeek,
  endOfWeek,
  differenceInWeeks,
  addWeeks,
  isWithinInterval,
  isSameWeek,
} from 'date-fns';

/**
 * Get the start of the week (Monday) for a given date
 */
export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday = 1
};

/**
 * Get the end of the week (Sunday) for a given date
 */
export const getWeekEnd = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Calculate the number of weeks between two dates
 */
export const getWeeksBetween = (startDate: Date, endDate: Date): number => {
  return differenceInWeeks(endDate, startDate);
};

/**
 * Add N weeks to a date
 */
export const addWeeksToDate = (date: Date, weeks: number): Date => {
  return addWeeks(date, weeks);
};

/**
 * Check if a date is within a date range
 */
export const isDateInRange = (
  date: Date,
  start: Date,
  end: Date
): boolean => {
  return isWithinInterval(date, { start, end });
};

/**
 * Check if two dates are in the same week
 */
export const isSameWeekAs = (date1: Date, date2: Date): boolean => {
  return isSameWeek(date1, date2, { weekStartsOn: 1 });
};

/**
 * Format a date range as "1 Jan - 7 Jan 2024"
 */
export const formatWeekRange = (start: Date, end: Date): string => {
  const startMonth = format(start, 'd MMM');
  const endFull = format(end, 'd MMM yyyy');
  return `${startMonth} - ${endFull}`;
};

/**
 * Format a date as ISO string for storage
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO string to Date
 */
export const fromISOString = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Get current date
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * Validate if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Format a date for display (e.g., "January 1, 1990")
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};
