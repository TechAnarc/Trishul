import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Platform } from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { COLORS, SPACING, METRICS, SHADOWS } from '../../../theme';
import Button from '../../../components/Button';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import Card from '../../../components/Card';
import { TRIP_STATUS } from '../../../constants';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// Mock Data structure based on the schema
const MOCK_STATS = {
  activeTrips: 12,
  pendingInvoices: 8,
  availableDrivers: 15,
  revenue: 45000,
};

const MOCK_RECENT_TRIPS = [
  { id: '1', driver: 'Raj Kumar', status: TRIP_STATUS.IN_PROGRESS, client: 'TechCorp', endLocation: 'Airport' },
  { id: '2', driver: 'Amit Singh', status: TRIP_STATUS.SCHEDULED, client: 'Acme Inc', endLocation: 'City Center' },
  { id: '3', driver: 'Vikram', status: TRIP_STATUS.COMPLETED, client: 'Hotel Zenith', endLocation: 'Train Station' },
];

const MOCK_DRIVERS = [
  { id: '1', name: 'Raj Kumar', status: 'ON TRIP' },
  { id: '2', name: 'Amit Singh', status: 'AVAILABLE' },
  { id: '3', name: 'Vikram', status: 'OFF DUTY' },
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS': return COLORS.warning;
      case 'ON TRIP': return COLORS.warning;
      case 'COMPLETED': return COLORS.success;
      case 'AVAILABLE': return COLORS.success;
      case 'SCHEDULED': return COLORS.primary;
      default: return COLORS.textTertiary;
    }
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonBlock, { height: 100, marginBottom: SPACING.md }]} />
      <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg }}>
        <View style={[styles.skeletonBlock, { flex: 1, height: 120 }]} />
        <View style={[styles.skeletonBlock, { flex: 1, height: 120 }]} />
      </View>
      <View style={[styles.skeletonBlock, { height: 200 }]} />
    </View>
  );

  return (
    <SafeView>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Typography variant="h2" style={styles.title}>Dashboard</Typography>
              <Typography variant="body" color="textSecondary">Welcome back, {user?.name}</Typography>
            </View>
            <Button title="Logout" variant="outline" onPress={logout} style={styles.logoutButton} textStyle={{ fontSize: 13 }} />
          </View>

          {loading ? renderSkeleton() : (
            <Animated.View entering={FadeIn.duration(400)}>
              
              {/* Stats Overview */}
              <View style={styles.statsGrid}>
                <Card elevated style={styles.statCard}>
                  <Typography variant="caption" color="textSecondary" style={styles.statLabel}>Active Trips</Typography>
                  <Typography variant="h1" color="primary">{MOCK_STATS.activeTrips}</Typography>
                </Card>
                <Card elevated style={styles.statCard}>
                  <Typography variant="caption" color="textSecondary" style={styles.statLabel}>Pending Invoices</Typography>
                  <Typography variant="h1">{MOCK_STATS.pendingInvoices}</Typography>
                </Card>
                <Card elevated style={styles.statCard}>
                  <Typography variant="caption" color="textSecondary" style={styles.statLabel}>Available Drivers</Typography>
                  <Typography variant="h1">{MOCK_STATS.availableDrivers}</Typography>
                </Card>
                <Card elevated style={styles.statCard}>
                  <Typography variant="caption" color="textSecondary" style={styles.statLabel}>Est. Revenue</Typography>
                  <Typography variant="h2" style={{ marginTop: 8 }}>₹{MOCK_STATS.revenue.toLocaleString()}</Typography>
                </Card>
              </View>

              <View style={styles.dashboardBody}>
                
                {/* Recent Trips Section */}
                <View style={styles.mainColumn}>
                  <View style={styles.sectionHeader}>
                    <Typography variant="h3">Recent Trips</Typography>
                    <Typography variant="caption" color="primary" style={styles.viewAll}>View All</Typography>
                  </View>
                  
                  <Card style={styles.listCard} padded={false}>
                    {MOCK_RECENT_TRIPS.map((trip, index) => (
                      <Animated.View 
                        key={trip.id} 
                        entering={FadeInDown.delay(index * 100).springify()}
                        style={[styles.listItem, index !== MOCK_RECENT_TRIPS.length - 1 && styles.borderBottom]}
                      >
                        <View style={styles.tripInfo}>
                          <Typography variant="bodySemibold">{trip.client}</Typography>
                          <Typography variant="caption" color="textSecondary">Driver: {trip.driver} • to {trip.endLocation}</Typography>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '15' }]}>
                          <Typography variant="caption" style={{ color: getStatusColor(trip.status), fontWeight: '700' }}>
                            {trip.status}
                          </Typography>
                        </View>
                      </Animated.View>
                    ))}
                    {MOCK_RECENT_TRIPS.length === 0 && (
                      <View style={styles.emptyState}>
                        <Typography variant="body" color="textTertiary">No recent trips found.</Typography>
                      </View>
                    )}
                  </Card>
                </View>

                {/* Driver Activity Section */}
                <View style={styles.sideColumn}>
                  <View style={styles.sectionHeader}>
                    <Typography variant="h3">Driver Activity</Typography>
                  </View>
                  
                  <Card style={styles.listCard} padded={false}>
                    {MOCK_DRIVERS.map((driver, index) => (
                      <Animated.View 
                        key={driver.id} 
                        entering={FadeInDown.delay((index + MOCK_RECENT_TRIPS.length) * 100).springify()}
                        style={[styles.listItem, index !== MOCK_DRIVERS.length - 1 && styles.borderBottom]}
                      >
                        <View style={styles.driverInfo}>
                          <View style={styles.avatarPlaceholder}>
                            <Typography variant="caption" color="primary">{driver.name.charAt(0)}</Typography>
                          </View>
                          <Typography variant="bodySemibold">{driver.name}</Typography>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(driver.status) }]} />
                      </Animated.View>
                    ))}
                  </Card>
                </View>

              </View>
            </Animated.View>
          )}

        </View>
      </ScrollView>
    </SafeView>
  );
};

const isWeb = Platform.OS === 'web';
const screenWidth = Dimensions.get('window').width;
const isDesktop = isWeb && screenWidth > 1024;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    maxWidth: 1200, // Enterprise ultra-wide constraint
    alignSelf: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  statCard: {
    flex: 1,
    minWidth: isDesktop ? 200 : '45%',
    padding: SPACING.lg,
  },
  statLabel: {
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dashboardBody: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: SPACING.xl,
  },
  mainColumn: {
    flex: isDesktop ? 2 : 1,
  },
  sideColumn: {
    flex: isDesktop ? 1 : 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  viewAll: {
    fontWeight: '600',
  },
  listCard: {
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  borderBottom: {
    borderBottomWidth: METRICS.borderWidth,
    borderBottomColor: COLORS.borderSubtle,
  },
  tripInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: METRICS.pillRadius,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  
  // Skeleton Loader Styles
  skeletonContainer: {
    opacity: 0.5,
  },
  skeletonBlock: {
    backgroundColor: COLORS.border,
    borderRadius: METRICS.largeRadius,
  },
});

export default AdminDashboard;
