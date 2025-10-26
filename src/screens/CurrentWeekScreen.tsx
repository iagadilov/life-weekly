/**
 * Current Week Screen
 * Shows details about the user's current week
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing } from '../theme';
import { calculateWeeksSinceBirth, calculateAge } from '../services/weekCalculator';
import { getWeekStart, getWeekEnd, formatWeekRange } from '../utils/date';
import { triggerHaptic } from '../utils/haptics';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CurrentWeek'>;

const CurrentWeekScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userProfile } = useApp();

  const birthdate = useMemo(() => {
    if (!userProfile?.birthdate) return new Date();
    return new Date(userProfile.birthdate);
  }, [userProfile]);

  const currentWeekNumber = useMemo(
    () => calculateWeeksSinceBirth(birthdate),
    [birthdate]
  );

  const age = useMemo(() => calculateAge(birthdate), [birthdate]);

  const weekRange = useMemo(() => {
    const now = new Date();
    const start = getWeekStart(now);
    const end = getWeekEnd(now);
    return formatWeekRange(start, end);
  }, []);

  const handleClose = () => {
    triggerHaptic('selection');
    navigation.goBack();
  };

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
        <Text style={styles.headerTitle}>Текущая неделя</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Number */}
        <View style={styles.weekNumberCard}>
          <Text style={styles.weekNumberLabel}>Неделя</Text>
          <Text style={styles.weekNumber}>{currentWeekNumber}</Text>
          <Text style={styles.weekNumberSubtitle}>вашей жизни</Text>
        </View>

        {/* Date Range */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Период</Text>
          <Text style={styles.infoValue}>{weekRange}</Text>
        </View>

        {/* Age */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Ваш возраст</Text>
          <Text style={styles.infoValue}>{age} лет</Text>
        </View>

        {/* Quote/Motivation */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>💭</Text>
          <Text style={styles.quoteText}>
            "Дни длинные, но годы короткие. Сделайте эту неделю значимой."
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Эта неделя</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Дней</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>168</Text>
              <Text style={styles.statLabel}>Часов</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10 080</Text>
              <Text style={styles.statLabel}>Минут</Text>
            </View>
          </View>
        </View>

        {/* Reflection Placeholder */}
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>Размышления о неделе</Text>
          <Text style={styles.reflectionPlaceholder}>
            Скоро: добавьте заметки и размышления о вашей неделе
          </Text>
        </View>
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
    backgroundColor: colors.accents.blue,
    borderRadius: 20,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  weekNumberLabel: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  weekNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  weekNumberSubtitle: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
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
  quoteCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  quoteText: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  statsSection: {
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
  },
  reflectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  reflectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  reflectionPlaceholder: {
    ...typography.body,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
});

export default CurrentWeekScreen;
