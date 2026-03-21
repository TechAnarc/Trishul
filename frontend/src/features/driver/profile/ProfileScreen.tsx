import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [isOnDuty, setIsOnDuty] = React.useState(true);

  const getInitials = (name?: string) => {
    if (!name) return 'RS';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <SafeView style={styles.safeArea}>
      
      {/* Top App Bar inside Content to match design flow */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Avatar Header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Typography variant="h1" style={styles.avatarText}>{getInitials(user?.name)}</Typography>
            <View style={styles.onlineBadge} />
          </View>
          <Typography variant="h2" style={styles.nameText}>{user?.name || 'Rajan Sharma'}</Typography>
          <Typography variant="caption" color="textTertiary" style={styles.subText}>DRV-2041 • Joined Jan 2022</Typography>
          
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Typography variant="caption" style={{ color: COLORS.success, fontWeight: '600' }}>On Duty</Typography>
            </View>
            <View style={styles.vehicleBadge}>
              <Typography variant="caption" style={{ color: COLORS.secondary, fontWeight: '600' }}>Innova Crysta</Typography>
            </View>
          </View>
        </View>

        {/* Shift Toggle Card */}
        <View style={styles.shiftCard}>
          <Typography variant="bodySemibold" style={{ color: '#FFF' }}>Shift Status</Typography>
          <Switch 
            value={isOnDuty} 
            onValueChange={setIsOnDuty}
            trackColor={{ false: COLORS.surfaceHighlight, true: COLORS.success }}
            thumbColor={'#FFF'}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Typography variant="h3" style={{ color: COLORS.primary }}>284</Typography>
            <Typography variant="caption" color="textTertiary">Trips</Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="h3" style={{ color: '#00F0FF' }}>48k km</Typography>
            <Typography variant="caption" color="textTertiary">Distance</Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="h3" style={{ color: COLORS.success }}>₹4.2L</Typography>
            <Typography variant="caption" color="textTertiary">Earned</Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="h3" style={{ color: '#FFD700' }}>4.9★</Typography>
            <Typography variant="caption" color="textTertiary">Rating</Typography>
          </View>
        </View>

        {/* Rating Breakdown */}
        <View style={styles.card}>
          <Typography variant="subtitle" style={styles.cardTitle}>Rating breakdown</Typography>
          <View style={styles.ratingRow}>
            <View style={styles.ratingNumberBox}>
              <Typography variant="h1" style={{ fontSize: 48, lineHeight: 54, color: '#FFF' }}>4.9</Typography>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color="#FFD700" />)}
              </View>
              <Typography variant="caption" color="textTertiary" style={{ marginTop: 4 }}>48 reviews</Typography>
            </View>

            <View style={styles.ratingBarsBox}>
              {[
                { star: 5, value: 39, pct: 90, color: COLORS.success },
                { star: 4, value: 6, pct: 15, color: COLORS.successSubtle },
                { star: 3, value: 2, pct: 5, color: COLORS.primary },
                { star: 2, value: 1, pct: 2, color: COLORS.error },
                { star: 1, value: 0, pct: 0, color: COLORS.textTertiary },
              ].map(row => (
                <View key={row.star} style={styles.barRow}>
                  <Typography variant="caption" color="textTertiary">{row.star}★</Typography>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${row.pct}%`, backgroundColor: row.color }]} />
                  </View>
                  <Typography variant="caption" color="textTertiary" style={styles.barCount}>{row.value}</Typography>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Typography variant="subtitle" style={styles.cardTitle}>Documents</Typography>
          
          <View style={styles.docRow}>
            <View style={styles.docLeft}>
              <Ionicons name="card-outline" size={20} color={COLORS.textTertiary} />
              <Typography variant="bodySemibold" style={styles.docText}>Driving Licence</Typography>
            </View>
            <View style={styles.tagValid}><Typography variant="caption" style={styles.tagValidText}>Valid</Typography></View>
          </View>

          <View style={styles.docRow}>
            <View style={styles.docLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textTertiary} />
              <Typography variant="bodySemibold" style={styles.docText}>Insurance</Typography>
            </View>
            <View style={styles.tagExpiring}><Typography variant="caption" style={styles.tagExpiringText}>Expiring</Typography></View>
          </View>

          <View style={[styles.docRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.docLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.textTertiary} />
              <Typography variant="bodySemibold" style={styles.docText}>Vehicle RC</Typography>
            </View>
            <View style={styles.tagValid}><Typography variant="caption" style={styles.tagValidText}>Valid</Typography></View>
          </View>
        </View>

      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  settingsBtn: {
    padding: SPACING.xs,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    marginBottom: SPACING.sm,
  },
  avatarText: {
    color: COLORS.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  nameText: {
    color: '#FFF',
    marginBottom: 4,
  },
  subText: {
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: METRICS.pillRadius,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  vehicleBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: METRICS.pillRadius,
  },
  shiftCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: METRICS.largeRadius,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statBox: {
    width: '23%',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    borderRadius: METRICS.baseRadius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: SPACING.lg,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  ratingNumberBox: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  ratingBarsBox: {
    width: '60%',
    paddingLeft: SPACING.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  barCount: {
    width: 20,
    textAlign: 'right',
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.surfaceHighlight,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  docText: {
    color: '#FFF',
  },
  tagValid: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagValidText: {
    color: COLORS.success,
    fontWeight: '700',
  },
  tagExpiring: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagExpiringText: {
    color: COLORS.warning,
    fontWeight: '700',
  },
});

export default ProfileScreen;
