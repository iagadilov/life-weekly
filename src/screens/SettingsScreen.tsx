/**
 * Settings Screen
 * App settings and user profile management
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing } from '../theme';
import { formatDate } from '../utils/date';
import { triggerHaptic } from '../utils/haptics';
import { calculateAge } from '../services/weekCalculator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userProfile, updateUserProfile, clearUserData } = useApp();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempBirthdate, setTempBirthdate] = useState<Date>(() => {
    if (userProfile?.birthdate) {
      return new Date(userProfile.birthdate);
    }
    return new Date(1990, 0, 1);
  });

  const currentBirthdate = useMemo(() => {
    if (!userProfile?.birthdate) return new Date(1990, 0, 1);
    return new Date(userProfile.birthdate);
  }, [userProfile]);

  const age = useMemo(() => calculateAge(currentBirthdate), [currentBirthdate]);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setTempBirthdate(selectedDate);
      triggerHaptic('selection');
    }
  };

  const handleSaveBirthdate = async () => {
    triggerHaptic('success');
    await updateUserProfile({
      birthdate: tempBirthdate.toISOString(),
    });
    setShowDatePicker(false);
    Alert.alert('Успешно', 'Ваша дата рождения обновлена');
  };

  const handleCancelDateEdit = () => {
    triggerHaptic('selection');
    setTempBirthdate(currentBirthdate);
    setShowDatePicker(false);
  };

  const handleResetData = () => {
    triggerHaptic('warning');
    Alert.alert(
      'Сбросить все данные',
      'Вы уверены, что хотите сбросить все данные? Это удалит вашу дату рождения и данные. Это действие нельзя отменить.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
          onPress: () => triggerHaptic('selection'),
        },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: async () => {
            triggerHaptic('success');
            await clearUserData();
          },
        },
      ]
    );
  };

  const handleBack = () => {
    triggerHaptic('selection');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Профиль</Text>

          {/* Current Birthdate */}
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Дата рождения</Text>
              <Text style={styles.settingValue}>{formatDate(currentBirthdate)}</Text>
              <Text style={styles.settingSubtext}>Возраст: {age} лет</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                triggerHaptic('selection');
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonText}>Изменить</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={handleCancelDateEdit}>
                  <Text style={styles.datePickerCancel}>Отмена</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Изменить дату рождения</Text>
                <TouchableOpacity onPress={handleSaveBirthdate}>
                  <Text style={styles.datePickerSave}>Сохранить</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempBirthdate}
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


        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Life Weeks помогает визуализировать вашу жизнь по неделям. Если вы проживете 90 лет, у вас будет примерно 4,680 недель.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Версия</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Опасная зона</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerButtonText}>Сбросить все данные</Text>
          </TouchableOpacity>
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
  backButton: {
    padding: spacing.sm,
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.primaryText,
    fontWeight: '300',
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
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: spacing.md,
  },
  dangerTitle: {
    color: colors.ui.error,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  settingValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.ui.success,
    marginBottom: spacing.xs,
  },
  settingSubtext: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  editButton: {
    backgroundColor: colors.ui.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  datePickerModal: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: '600',
  },
  datePickerCancel: {
    ...typography.body,
    color: colors.secondaryText,
  },
  datePickerSave: {
    ...typography.body,
    color: colors.ui.success,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 0,
    marginBottom: spacing.md,
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
    lineHeight: 22,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body,
    color: colors.primaryText,
  },
  dangerButton: {
    backgroundColor: colors.ui.error,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dangerButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default SettingsScreen;
