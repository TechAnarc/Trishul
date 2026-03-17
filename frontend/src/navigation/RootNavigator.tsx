import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './authNavigator';
import AdminNavigator from './adminNavigator';
import SuperAdminNavigator from './superAdminNavigator';
import DriverNavigator from './driverNavigator';
import { ROLES } from '../constants';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const RootNavigator: React.FC = () => {
  const { isAuthenticated, user, isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderContent = () => {
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    // Role-based navigation
    switch (user.role) {
      case ROLES.SUPER_ADMIN:
        return <SuperAdminNavigator />;
      case ROLES.ADMIN:
        return <AdminNavigator />;
      case ROLES.DRIVER:
        return <DriverNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {renderContent()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
