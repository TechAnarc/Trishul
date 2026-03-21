import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather } from '@expo/vector-icons';
import { driverApi, Trip } from '../../../services/driverApi';

const StartTripScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(true);
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [startingTrip, setStartingTrip] = React.useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      const data = await driverApi.getMyTrips();
      // Only show SCHEDULED trips
      const pendingTrips = data.filter(t => t.status === 'SCHEDULED');
      setTrips(pendingTrips);
    } catch (error) {
      console.error('Fetch Trips Error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTrips();
  }, []);

  const handleStartTrip = async (tripId: string) => {
    setStartingTrip(tripId);
    try {
      // In a real app, this would be an API call like driverApi.updateTripStatus(tripId, 'IN_PROGRESS')
      // For now, let's simulate and show success
      Alert.alert(
        "Start Trip",
        "Are you sure you want to start this trip?",
        [
          { text: "Cancel", style: "cancel", onPress: () => setStartingTrip(null) },
          { 
            text: "Start", 
            onPress: async () => {
               // navigation.navigate('Dashboard'); // Go back to dashboard which will now show the active trip
               // Normally we'd call the API here
               Alert.alert("Success", "Trip started successfully! Live tracking is now active.");
               navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to start trip. Please try again.");
    } finally {
      setStartingTrip(null);
    }
  };

  if (loading) {
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
        <Typography variant="h2" style={styles.title}>Start Trip</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Typography variant="subtitle" style={styles.sectionTitle}>Assigned Trips</Typography>
        
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={48} color={COLORS.textTertiary} />
            <Typography variant="body" color="textTertiary" style={{ marginTop: 16 }}>No pending trips assigned to you.</Typography>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity 
              key={trip.id} 
              style={styles.tripCard}
              activeOpacity={0.8}
              onPress={() => handleStartTrip(trip.id)}
            >
              <View style={styles.tripHeader}>
                <Typography variant="caption" color="textSecondary">{trip.tripCode}</Typography>
                <View style={[styles.statusBadge, { backgroundColor: trip.status === 'SCHEDULED' ? COLORS.primarySubtle : COLORS.surfaceHighlight }]}>
                  <Typography variant="caption" style={{ color: trip.status === 'SCHEDULED' ? COLORS.primary : COLORS.textSecondary }}>{trip.status}</Typography>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
                  <Typography variant="bodySemibold">{trip.startLocation}</Typography>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.routePoint}>
                  <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
                  <Typography variant="bodySemibold">{trip.endLocation}</Typography>
                </View>
              </View>

              <View style={styles.footer}>
                <View style={styles.clientInfo}>
                  <Ionicons name="person" size={14} color={COLORS.textSecondary} />
                  <Typography variant="caption" color="textSecondary" style={{ marginLeft: 4 }}>{trip.clientName}</Typography>
                </View>
                <TouchableOpacity style={styles.startBtn} onPress={() => handleStartTrip(trip.id)}>
                   {startingTrip === trip.id ? (
                     <ActivityIndicator size="small" color="#FFF" />
                   ) : (
                     <Typography variant="caption" style={styles.startBtnText}>START NOW</Typography>
                   )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
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
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  routeContainer: {
    marginBottom: SPACING.lg,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.borderSubtle,
    marginLeft: 3,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: SPACING.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: METRICS.baseRadius,
    minWidth: 100,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default StartTripScreen;
