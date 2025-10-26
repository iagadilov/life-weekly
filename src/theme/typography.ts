/**
 * Typography system for Life Weeks
 * Using iOS system fonts (SF Pro) as primary
 * Following Apple's Human Interface Guidelines
 */

import { Platform, TextStyle } from 'react-native';

// System font families
const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

// Font weights
const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

// Typography styles following iOS guidelines
export const typography = {
  // H1 - Large titles (34pt)
  h1: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
  } as TextStyle,

  // H2 - Titles (28pt)
  h2: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
  } as TextStyle,

  // H3 - Section headers (22pt)
  h3: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
  } as TextStyle,

  // Body - Default text (17pt)
  body: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  } as TextStyle,

  // Body Bold - Emphasized body text (17pt)
  bodyBold: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  } as TextStyle,

  // Small - Secondary text (15pt)
  small: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  } as TextStyle,

  // Caption - Tertiary text (13pt)
  caption: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  } as TextStyle,
} as const;

export default typography;
