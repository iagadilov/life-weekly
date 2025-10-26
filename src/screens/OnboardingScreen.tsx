/**
 * Onboarding Screen
 * First screen where user enters their birthdate
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { colors, typography, spacing } from '../theme';
import { formatDate } from '../utils/date';
import { triggerHaptic } from '../utils/haptics';

const OnboardingScreen: React.FC = () => {
  const { saveUserProfile } = useApp();
  const [birthdate, setBirthdate] = useState<Date>(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setBirthdate(selectedDate);
      triggerHaptic('selection');
    }
  };

  const handleContinue = async () => {
    triggerHaptic('success');

    // Create initial user profile
    await saveUserProfile({
      dateOfBirth: birthdate.toISOString(),
      birthdate: birthdate.toISOString(),
      lifeExpectancy: 90,
      onboardingCompleted: true,
    });
  };

  const openDatePicker = () => {
    triggerHaptic('selection');
    setShowDatePicker(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Life Weeks</Text>
          <Text style={styles.subtitle}>
            Visualize your life in weeks and make every week count
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            If you live to 90 years old, you have approximately{' '}
            <Text style={styles.infoHighlight}>4,680 weeks</Text> in your life.
          </Text>
          <Text style={[styles.infoText, styles.infoTextSecondary]}>
            Let's see how many you've lived so far.
          </Text>
        </View>

        {/* Date Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>When were you born?</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.dateButtonText}>
              {formatDate(birthdate)}
            </Text>
            <Text style={styles.dateButtonIcon}>→</Text>
          </TouchableOpacity>

          {(showDatePicker || Platform.OS === 'ios') && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={birthdate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                textColor={colors.primaryText}
                themeVariant="light"
              />
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          Your data is stored locally on your device
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 17,
    color: colors.secondaryText,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    ...typography.body,
    color: colors.secondaryText,
    lineHeight: 24,
  },
  infoHighlight: {
    color: colors.ui.success,
    fontWeight: '600',
  },
  infoTextSecondary: {
    marginTop: spacing.md,
  },
  inputSection: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: spacing.lg,
  },
  dateButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.ui.success,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
  },
  dateButtonIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ui.success,
  },
  datePickerContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButton: {
    backgroundColor: colors.ui.success,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footer: {
    ...typography.caption,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default OnboardingScreen;
