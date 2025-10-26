/**
 * App Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useApp } from '../context/AppContext';
import { colors, typography } from '../theme';

// Import screens (placeholder imports - we'll create these screens later)
// import OnboardingScreen from '../screens/OnboardingScreen';
// import LifeGridScreen from '../screens/LifeGridScreen';
// import WeekDetailScreen from '../screens/WeekDetailScreen';
// import CurrentWeekScreen from '../screens/CurrentWeekScreen';
// import SettingsScreen from '../screens/SettingsScreen';

// Temporary placeholder components
const OnboardingScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Onboarding Screen</Text>
  </View>
);

const LifeGridScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Life Grid Screen</Text>
  </View>
);

const WeekDetailScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Week Detail Screen</Text>
  </View>
);

const CurrentWeekScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Current Week Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Settings Screen</Text>
  </View>
);

// Create stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Loading component
const LoadingScreen = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color={colors.accents.blue} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main navigator component
const AppNavigator: React.FC = () => {
  const { userProfile, isLoading } = useApp();

  // Show loading screen while data is being loaded
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determine if user has completed onboarding
  const hasCompletedOnboarding = userProfile?.onboardingCompleted ?? false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // We'll use custom headers in each screen
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!hasCompletedOnboarding ? (
          // Show onboarding if not completed
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              gestureEnabled: false, // Prevent swiping back from onboarding
            }}
          />
        ) : (
          // Show main app screens
          <>
            <Stack.Screen name="LifeGrid" component={LifeGridScreen} />
            <Stack.Screen
              name="WeekDetail"
              component={WeekDetailScreen}
              options={{
                presentation: 'modal',
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
            <Stack.Screen
              name="CurrentWeek"
              component={CurrentWeekScreen}
              options={{
                presentation: 'modal',
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.secondaryText,
    marginTop: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderText: {
    ...typography.h2,
    color: colors.primaryText,
  },
});

export default AppNavigator;
