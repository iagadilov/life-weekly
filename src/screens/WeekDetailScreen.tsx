/**
 * Week Detail Screen
 * Shows details about a specific week in user's life
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing } from '../theme';
import { addWeeksToDate, getWeekStart, getWeekEnd, formatWeekRange } from '../utils/date';
import { triggerHaptic } from '../utils/haptics';
import { WEEKS_PER_YEAR } from '../constants/config';

type NavigationProp = StackNavigationProp<RootStackParamList, 'WeekDetail'>;
type WeekDetailRouteProp = RouteProp<RootStackParamList, 'WeekDetail'>;

const WeekDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WeekDetailRouteProp>();
  const { userProfile } = useApp();

  const { weekNumber } = route.params;

  const birthdate = useMemo(() => {
    if (!userProfile?.birthdate) return new Date();
    return new Date(userProfile.birthdate);
  }, [userProfile]);

  // Calculate the date range for this specific week
  const weekInfo = useMemo(() => {
    // Add weekNumber weeks to birthdate to get the start of this week
    const weekStartDate = addWeeksToDate(birthdate, weekNumber);
    const start = getWeekStart(weekStartDate);
    const end = getWeekEnd(weekStartDate);
    const range = formatWeekRange(start, end);

    // Calculate year of life (0-indexed)
    const yearOfLife = Math.floor(weekNumber / WEEKS_PER_YEAR);
    const weekInYear = (weekNumber % WEEKS_PER_YEAR) + 1;

    // Determine status
    const now = new Date();
    const isPast = end < now;
    const isFuture = start > now;

    return {
      start,
      end,
      range,
      yearOfLife,
      weekInYear,
      isPast,
      isFuture,
    };
  }, [birthdate, weekNumber]);

  const handleClose = () => {
    triggerHaptic('selection');
    navigation.goBack();
  };

  const getStatusInfo = () => {
    if (weekInfo.isPast) {
      return {
        label: 'Past Week',
        emoji: '✅',
        color: colors.weekColors.past,
      };
    } else if (weekInfo.isFuture) {
      return {
        label: 'Future Week',
        emoji: '🔮',
        color: colors.weekColors.future,
      };
    } else {
      return {
        label: 'Current Week',
        emoji: '⭐',
        color: colors.weekColors.current,
      };
    }
  };

  const status = getStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Week Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Number Card */}
        <View style={[styles.weekNumberCard, { backgroundColor: status.color }]}>
          <Text style={styles.weekNumberEmoji}>{status.emoji}</Text>
          <Text style={styles.weekNumberLabel}>Week</Text>
          <Text style={styles.weekNumber}>{weekNumber + 1}</Text>
          <Text style={styles.weekNumberSubtitle}>{status.label}</Text>
        </View>

        {/* Date Range */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Date Range</Text>
          <Text style={styles.infoValue}>{weekInfo.range}</Text>
        </View>

        {/* Year of Life */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Year of Life</Text>
          <Text style={styles.infoValue}>
            Year {weekInfo.yearOfLife + 1}, Week {weekInfo.weekInYear}
          </Text>
        </View>

        {/* Position Info */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Timeline Position</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weekInfo.yearOfLife + 1}</Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weekInfo.weekInYear}</Text>
              <Text style={styles.statLabel}>Week of Year</Text>
            </View>
          </View>
        </View>

        {/* Notes Placeholder */}
        {weekInfo.isPast && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Week Notes</Text>
            <Text style={styles.notesPlaceholder}>
              Coming soon: Add notes and memories about this week
            </Text>
          </View>
        )}

        {weekInfo.isFuture && (
          <View style={styles.futureCard}>
            <Text style={styles.futureEmoji}>🎯</Text>
            <Text style={styles.futureTitle}>Plan Ahead</Text>
            <Text style={styles.futurePlaceholder}>
              Coming soon: Set goals and plans for future weeks
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.sm,
    width: 40,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.primaryText,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primaryText,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  weekNumberCard: {
    borderRadius: 20,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  weekNumberEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  weekNumberLabel: {
    ...typography.body,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: spacing.xs,
  },
  weekNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  weekNumberSubtitle: {
    ...typography.body,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.h3,
    color: colors.primaryText,
  },
  statsSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  statsSectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...typography.h2,
    color: colors.accents.blue,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  notesTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  notesPlaceholder: {
    ...typography.body,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  futureCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  futureEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  futureTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  futurePlaceholder: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WeekDetailScreen;
