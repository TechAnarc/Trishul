import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { COLORS, SPACING, METRICS } from '../../../theme';
import Button from '../../../components/Button';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import Card from '../../../components/Card';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeView>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View>
              <Typography variant="h2" style={styles.title}>Driver Home</Typography>
              <Typography variant="body" color="textSecondary">Welcome, {user?.name}</Typography>
            </View>
            <Button title="Logout" variant="outline" onPress={logout} style={styles.logoutButton} textStyle={{ fontSize: 13 }} />
          </View>

          <Card elevated style={styles.card}>
            <Typography variant="h3" style={{ marginBottom: SPACING.lg }}>Active Trip</Typography>
            <View style={styles.emptyState}>
              <Typography variant="body" color="textTertiary">No active trip currently.</Typography>
            </View>
          </Card>

        </View>
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xxs,
  },
  logoutButton: {
    width: 100,
    height: 40,
  },
  card: {
    padding: SPACING.xl,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});

export default DriverDashboard;
