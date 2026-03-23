import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { useI18nStore } from '../../../store/i18nStore';
import { COLORS, SPACING, METRICS, SHADOWS, TYPOGRAPHY } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { driverApi, DriverProfile, Trip, DriverLedger } from '../../../services/driverApi';
import { useLocationTracking } from '../../../hooks/useLocationTracking';

const { width } = Dimensions.get('window');

const DriverDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const { t } = useI18nStore();

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [profile, setProfile] = React.useState<DriverProfile | null>(null);
  const [activeTrip, setActiveTrip] = React.useState<Trip | null>(null);
  const [ledger, setLedger] = React.useState<DriverLedger | null>(null);

  // Initialize GPS tracking if there is an active trip
  const { liveLocation } = useLocationTracking(activeTrip?.id || null);

  const fetchData = async () => {
    try {
      const [p, t, l] = await Promise.all([
        driverApi.getProfile(),
        driverApi.getActiveTrip(),
        driverApi.getLedger()
      ]);
      setProfile(p);
      setActiveTrip(t);
      setLedger(l);
    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'RS';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading && !refreshing) {
    return (
      <SafeView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.profileRow} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Typography variant="bodySemibold" style={styles.avatarText}>{getInitials(user?.name)}</Typography>
            </View>
            <View style={styles.greetingBox}>
              <Typography variant="h3" style={styles.greeting}>{t('greeting')}, {user?.name || 'Rajan'} 👋</Typography>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: profile?.isAvailable ? COLORS.success : COLORS.textTertiary }]} />
                <Typography variant="caption" color="textSecondary">
                  {profile?.isAvailable ? t('active') : 'Offline'} • {profile?.licenseNumber || 'DRV-NEW'}
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <Typography variant="caption" color="textSecondary" style={styles.earningsTitle}>{t('todayEarnings')}</Typography>
          <View style={styles.earningsRow}>
            <View>
              <Typography variant="h1" style={styles.earningsAmount}>₹{ledger?.totalEarnings.toLocaleString() || '0'}</Typography>
              <Typography variant="caption" color="textTertiary">{ledger?.completedTrips || 0} {t('tripsCompleted')}</Typography>
            </View>
            {ledger?.totalEarnings && ledger.totalEarnings > 0 ? (
              <View style={styles.earningsBadge}>
                <Typography variant="caption" style={styles.earningsBadgeText}>+₹{Math.floor(ledger.totalEarnings * 0.2).toLocaleString()} {t('vsYesterday')}</Typography>
              </View>
            ) : null}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { id: '1', icon: 'map', color: '#00F0FF', value: (ledger?.totalTrips || 0).toString(), label: t('trips') },
            { id: '2', icon: 'map-pin', color: '#EF4444', value: `${activeTrip?.distance || 0}km`, label: t('distance') },
            { id: '3', icon: 'clock', color: '#FFD700', value: 'Live', label: t('drive') },
            { id: '4', icon: 'star', color: '#10B981', value: '4.9', label: t('rating') },
          ].map((stat) => (
            <View key={stat.id} style={styles.statBox}>
              <Feather name={stat.icon as any} size={22} color={stat.color} style={{ marginBottom: 8 }} />
              <Typography variant="h3" style={{ color: stat.color }}>{stat.value}</Typography>
              <Typography variant="caption" color="textTertiary">{stat.label}</Typography>
            </View>
          ))}
        </View>

        {/* Active Trip Section */}
        {activeTrip ? (
          <>
            <View style={styles.sectionHeader}>
              <Typography variant="subtitle" style={styles.sectionTitle}>{t('activeTrip')}</Typography>
              <Typography variant="caption" color="textSecondary">Details →</Typography>
            </View>

            <View style={styles.activeTripCard}>
              <View style={styles.tripHeaderLine}>
                <View style={styles.inProgressBadge}>
                  <View style={styles.inProgressDot} />
                  <Typography variant="caption" style={styles.inProgressText}>{t('inProgress')}</Typography>
                </View>
                <Typography variant="caption" color="textSecondary">{activeTrip.tripCode}</Typography>
              </View>

              <View style={styles.routeContainer}>
                <View style={[styles.routeRow, { flex: 1 }]}>
                  <View style={[styles.routeDot, { backgroundColor: COLORS.secondary }]} />
                  <Typography variant="bodySemibold" numberOfLines={1}>{activeTrip.startLocation}</Typography>
                </View>
                <View style={styles.routeDottedLine} />
                <View style={[styles.routeRow, { flex: 1, justifyContent: 'flex-end' }]}>
                  <View style={[styles.routeDot, { backgroundColor: COLORS.primary }]} />
                  <Typography variant="bodySemibold" numberOfLines={1}>{activeTrip.endLocation}</Typography>
                </View>
              </View>

              <View style={styles.tripMetrics}>
                <View>
                  <Typography variant="bodySemibold">{liveLocation?.speed.toFixed(0) || '0'} km/h</Typography>
                  <Typography variant="caption" color="textSecondary">Speed</Typography>
                </View>
                <View>
                  <Typography variant="bodySemibold">{activeTrip.distance || 0} km</Typography>
                  <Typography variant="caption" color="textSecondary">{t('distance')}</Typography>
                </View>
                <View>
                  <Typography variant="bodySemibold" style={{ color: COLORS.success }}>₹{activeTrip.invoice?.totalFare || '---'}</Typography>
                  <Typography variant="caption" color="textSecondary">{t('fare')}</Typography>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noTripCard}>
             <Feather name="coffee" size={24} color={COLORS.textTertiary} />
             <Typography variant="body" color="textTertiary" style={{ marginTop: 8 }}>No active trip. Ready to roll?</Typography>
          </View>
        )}

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Typography variant="subtitle" style={styles.sectionTitle}>{t('quickActions')}</Typography>
        </View>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionBlock}
            onPress={() => navigation.navigate('StartTrip')}
          >
            <Ionicons name="play" size={28} color={COLORS.secondary} />
            <Typography variant="bodySemibold" style={styles.actionText}>{t('startTrip')}</Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBlock}
            onPress={() => navigation.navigate('MyTrips')}
          >
            <Ionicons name="document-text" size={28} color="#FFD700" />
            <Typography variant="bodySemibold" style={styles.actionText}>{t('myTrips')}</Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBlock}
            onPress={() => navigation.navigate('Ledger')}
          >
            <Ionicons name="stats-chart" size={28} color={COLORS.success} />
            <Typography variant="bodySemibold" style={styles.actionText}>{t('ledger')}</Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBlock, { borderColor: 'rgba(239,68,68,0.3)' }]}
            onPress={() => navigation.navigate('Emergency')}
          >
            <Ionicons name="warning" size={28} color={COLORS.error} />
            <Typography variant="bodySemibold" style={{ color: COLORS.error, marginTop: 8 }}>{t('emergency')}</Typography>
          </TouchableOpacity>
        </View>

        {/* Alerts */}
        <View style={styles.sectionHeader}>
          <Typography variant="subtitle" style={styles.sectionTitle}>{t('alerts')}</Typography>
        </View>
        <View style={styles.alertCard}>
          <MaterialCommunityIcons name="gas-station" size={24} color={COLORS.warning} />
          <Typography variant="body" style={styles.alertText}>Current Vehicle: {profile?.assignedVehicle[0]?.vehicle.vehicleNumber || 'No Assigned Vehicle'}</Typography>
        </View>
        {activeTrip && (
          <View style={[styles.alertCard, { borderLeftColor: COLORS.secondary, marginBottom: 40 }]}>
            <MaterialCommunityIcons name="information" size={24} color={COLORS.secondary} />
            <Typography variant="body" style={styles.alertText}>Client: {activeTrip.clientName} ({activeTrip.clientPhone})</Typography>
          </View>
        )}

      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  avatarText: {
    color: COLORS.primary,
  },
  greetingBox: {
    marginLeft: SPACING.md,
  },
  greeting: {
    marginBottom: 2,
    color: '#FFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  earningsTitle: {
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsAmount: {
    color: COLORS.primary,
    marginBottom: 4,
  },
  earningsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  earningsBadgeText: {
    color: COLORS.success,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statBox: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.baseRadius,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: '#FFF',
  },
  activeTripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tripHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  inProgressText: {
    color: COLORS.success,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  routeDottedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1.5,
    borderColor: COLORS.borderSubtle,
    borderStyle: 'dashed',
    marginHorizontal: SPACING.sm,
  },
  tripMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionBlock: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  actionText: {
    marginTop: 8,
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: METRICS.baseRadius,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  noTripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    marginLeft: SPACING.sm,
    flex: 1,
    color: COLORS.text,
  },
});

export default DriverDashboard;
