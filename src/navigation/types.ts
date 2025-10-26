/**
 * Navigation types for React Navigation
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Week } from '../types';

// Root stack parameter list
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

// Navigation prop types for each screen
export type OnboardingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

export type LifeGridNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LifeGrid'
>;

export type WeekDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WeekDetail'
>;

export type CurrentWeekNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CurrentWeek'
>;

export type SettingsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

// Route prop types for each screen
export type WeekDetailRouteProp = RouteProp<RootStackParamList, 'WeekDetail'>;
