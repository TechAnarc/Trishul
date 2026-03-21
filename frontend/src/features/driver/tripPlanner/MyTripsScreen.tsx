import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather } from '@expo/vector-icons';
import { driverApi, Trip } from '../../../services/driverApi';

const MyTripsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [trips, setTrips] = React.useState<Trip[]>([]);

  const fetchTrips = async () => {
    try {
      const data = await driverApi.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Fetch My Trips Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchTrips();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return COLORS.secondary;
      case 'COMPLETED': return COLORS.success;
      case 'CANCELLED': return COLORS.error;
      case 'SCHEDULED': return COLORS.primary;
      default: return COLORS.textTertiary;
    }
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity 
      style={styles.tripCard}
      activeOpacity={0.8}
      onPress={() => {
          // Future: Navigate to TripDetail
      }}
    >
      <View style={styles.cardHeader}>
        <View>
          <Typography variant="bodySemibold" style={styles.tripCode}>{item.tripCode}</Typography>
          <Typography variant="caption" color="textSecondary">{new Date(item.scheduledAt || item.startTime || new Date()).toLocaleDateString()}</Typography>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) }]}>
          <Typography variant="caption" style={{ color: getStatusColor(item.status), fontWeight: '700' }}>{item.status}</Typography>
        </View>
      </View>

      <View style={styles.routeBox}>
        <View style={styles.routeItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
          <Typography variant="body" numberOfLines={1}>{item.startLocation}</Typography>
        </View>
        <View style={styles.connector} />
        <View style={styles.routeItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <Typography variant="body" numberOfLines={1}>{item.endLocation}</Typography>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.clientRow}>
          <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
          <Typography variant="caption" color="textSecondary" style={{ marginLeft: 4 }}>{item.clientName}</Typography>
        </View>
        {item.distance && (
          <Typography variant="caption" color="textTertiary">{item.distance} km</Typography>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeView>
    );
  }

  return (
    <SafeView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Typography variant="h2" style={styles.title}>History</Typography>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="folder" size={48} color={COLORS.textTertiary} />
            <Typography variant="body" color="textTertiary" style={{ marginTop: 16 }}>No trips found.</Typography>
          </View>
        }
      />
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  title: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  tripCode: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  routeBox: {
    marginBottom: SPACING.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  connector: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.borderSubtle,
    marginLeft: 2.5,
    marginVertical: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: SPACING.sm,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
});

export default MyTripsScreen;
