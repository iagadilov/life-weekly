/**
 * Life Grid Screen
 * Main screen showing the grid of life weeks
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing } from '../theme';
import { calculateWeeksSinceBirth, calculateAge } from '../services/weekCalculator';
import { triggerHaptic } from '../utils/haptics';
import { MAX_AGE_YEARS, WEEKS_PER_YEAR } from '../constants/config';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LifeGrid'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = spacing.xl; // Increased padding for more breathing room
const WEEK_SIZE = 5; // Optimized size
const WEEK_SPACING = 2.5; // Optimized spacing

interface WeekData {
  weekNumber: number;
  isPast: boolean;
  isCurrent: boolean;
  yearNumber: number;
}

const LifeGridScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userProfile } = useApp();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const birthdate = useMemo(() => {
    if (!userProfile?.birthdate) return new Date();
    return new Date(userProfile.birthdate);
  }, [userProfile]);

  const weeksSinceBirth = useMemo(
    () => calculateWeeksSinceBirth(birthdate),
    [birthdate]
  );

  const age = useMemo(() => calculateAge(birthdate), [birthdate]);

  // Generate preview weeks around current week
  const previewWeeks = useMemo((): WeekData[] => {
    const totalWeeks = MAX_AGE_YEARS * WEEKS_PER_YEAR;
    const weeksData: WeekData[] = [];

    // Show ~130 weeks before and ~130 weeks after current week (total ~260 weeks / 5 years)
    const previewRange = 130;
    const startWeek = Math.max(0, weeksSinceBirth - 1 - previewRange);
    const endWeek = Math.min(totalWeeks, weeksSinceBirth - 1 + previewRange);

    for (let i = startWeek; i < endWeek; i++) {
      weeksData.push({
        weekNumber: i,
        isPast: i < weeksSinceBirth - 1,
        isCurrent: i === weeksSinceBirth - 1,
        yearNumber: Math.floor(i / WEEKS_PER_YEAR),
      });
    }

    return weeksData;
  }, [weeksSinceBirth]);

  // Generate all weeks data
  const weeks = useMemo((): WeekData[] => {
    const totalWeeks = MAX_AGE_YEARS * WEEKS_PER_YEAR;
    const weeksData: WeekData[] = [];

    for (let i = 0; i < totalWeeks; i++) {
      weeksData.push({
        weekNumber: i,
        isPast: i < weeksSinceBirth - 1,
        isCurrent: i === weeksSinceBirth - 1,
        yearNumber: Math.floor(i / WEEKS_PER_YEAR),
      });
    }

    return weeksData;
  }, [weeksSinceBirth]);

  const handleWeekPress = useCallback(
    (week: WeekData) => {
      triggerHaptic('selection');

      if (week.isCurrent) {
        navigation.navigate('CurrentWeek');
      } else {
        navigation.navigate('WeekDetail', {
          weekNumber: week.weekNumber,
        });
      }
    },
    [navigation]
  );

  const handleSettingsPress = () => {
    triggerHaptic('selection');
    navigation.navigate('Settings');
  };

  const handleOpenModal = () => {
    triggerHaptic('selection');
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    triggerHaptic('selection');
    setIsModalVisible(false);
  };

  const renderWeek = (week: WeekData) => {
    let backgroundColor = colors.weekColors.future;

    if (week.isCurrent) {
      backgroundColor = colors.weekColors.current;
    } else if (week.isPast) {
      backgroundColor = colors.weekColors.past;
    }

    return (
      <TouchableOpacity
        key={week.weekNumber}
        style={[styles.week, { backgroundColor }]}
        onPress={() => handleWeekPress(week)}
        activeOpacity={0.7}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Life in Weeks</Text>
          <Text style={styles.headerSubtitle}>
            Age: {age} • Week: {weeksSinceBirth} of {MAX_AGE_YEARS * WEEKS_PER_YEAR}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Text style={styles.settingsButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.weekColors.past },
            ]}
          />
          <Text style={styles.legendText}>Past</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.weekColors.current },
            ]}
          />
          <Text style={styles.legendText}>Current</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.weekColors.future },
            ]}
          />
          <Text style={styles.legendText}>Future</Text>
        </View>
      </View>

      {/* Grid Preview */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {previewWeeks.map((week) => renderWeek(week))} {/* Show weeks around current week */}
          </View>
          <View style={styles.gridFade} />
        </View>

        {/* View Full Grid Button */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          <Text style={styles.expandButtonText}>
            View Full Grid
          </Text>
          <Text style={styles.expandButtonIcon}>
            →
          </Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {weeksSinceBirth - 1}
            </Text>
            <Text style={styles.statLabel}>Weeks Lived</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {MAX_AGE_YEARS * WEEKS_PER_YEAR - weeksSinceBirth + 1}
            </Text>
            <Text style={styles.statLabel}>Weeks Remaining</Text>
          </View>
        </View>
      </ScrollView>

      {/* Full Grid Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Your Life in Weeks</Text>
              <Text style={styles.modalSubtitle}>
                All {MAX_AGE_YEARS * WEEKS_PER_YEAR} weeks
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Full Grid */}
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.grid}>
              {weeks.map((week) => renderWeek(week))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxl * 1.5,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 0,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsButtonText: {
    fontSize: 24,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: 16,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  legendText: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  gridContainer: {
    position: 'relative',
    maxHeight: 300,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WEEK_SPACING,
  },
  gridFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  expandButton: {
    backgroundColor: colors.ui.success,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  expandButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  week: {
    width: WEEK_SIZE,
    height: WEEK_SIZE,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.ui.success,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '400',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingTop: spacing.xxl * 1.5,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  closeButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});

export default LifeGridScreen;
