import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { COLORS, SPACING, METRICS } from '../../../theme';
import SafeView from '../../../components/SafeView';
import Typography from '../../../components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { useI18nStore, SUPPORTED_LANGUAGES } from '../../../store/i18nStore';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();
  const { language, setLanguage, t } = useI18nStore();
  
  const [notifs, setNotifs] = React.useState(true);
  const [location, setLocation] = React.useState(true);
  const [sos, setSos] = React.useState(false);
  
  const [showLangModal, setShowLangModal] = React.useState(false);

  return (
    <SafeView style={styles.safeArea}>
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Typography variant="h3" style={{ color: '#FFF' }}>{t('settings')}</Typography>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* App Preferences */}
        <View style={styles.card}>
          <Typography variant="caption" color="textTertiary" style={styles.cardHeader}>{t('appPreferences')}</Typography>

          {/* Language Selector Trigger */}
          <TouchableOpacity style={styles.row} onPress={() => setShowLangModal(true)}>
            <View style={styles.rowLeft}>
              <Ionicons name="globe-outline" size={20} color={COLORS.secondary} />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('language')}</Typography>
            </View>
            <Typography variant="body" color="textTertiary">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.label} ›</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={20} color="#FFD700" />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('theme')}</Typography>
            </View>
            <Typography variant="body" color="textTertiary">Dark ›</Typography>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('notifs')}</Typography>
            </View>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: COLORS.success }} thumbColor="#FFF" />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={20} color="#EF4444" />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('locationAccess')}</Typography>
            </View>
            <Switch value={location} onValueChange={setLocation} trackColor={{ true: COLORS.success }} thumbColor="#FFF" />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="alert-circle-outline" size={20} color={COLORS.error} />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('autoSos')}</Typography>
            </View>
            <Switch value={sos} onValueChange={setSos} trackColor={{ true: COLORS.error }} thumbColor="#FFF" />
          </View>

          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#FFD700" />
              <Typography variant="bodySemibold" style={styles.rowText}>{t('security')}</Typography>
            </View>
            <Typography variant="body" color="textTertiary">PIN + OTP ›</Typography>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.card}>
          <Typography variant="caption" color="textTertiary" style={styles.cardHeader}>{t('emergencyContacts')}</Typography>

          <View style={styles.contactRow}>
            <View style={styles.contactIconBg}>
              <Ionicons name="business" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.contactInfo}>
              <Typography variant="bodySemibold" style={{ color: '#FFF' }}>{t('adminControl')}</Typography>
              <Typography variant="caption" color="textTertiary">+91 98765 43210</Typography>
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
              <Ionicons name="call" size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <View style={[styles.contactRow, { borderBottomWidth: 0, paddingBottom: 0, paddingTop: SPACING.md }]}>
            <View style={styles.contactIconBg}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Typography variant="bodySemibold" style={{ color: '#FFF' }}>{t('family')}</Typography>
              <Typography variant="caption" color="textTertiary">+91 87654 32109</Typography>
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
              <Ionicons name="call" size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Typography variant="button" style={styles.signOutText}>{t('signOut')}</Typography>
        </TouchableOpacity>

      </ScrollView>

      {/* Language Selection Modal */}
      <Modal visible={showLangModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Typography variant="h3" style={{ color: '#FFF', marginBottom: SPACING.md }}>Select App Language</Typography>
            <Typography variant="body" color="textSecondary" style={{ marginBottom: SPACING.lg }}>
              This will globally restart your layout localization natively without refreshing the device.
            </Typography>

            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, language === lang.code && styles.langOptionActive]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLangModal(false);
                }}
              >
                <Typography variant="bodySemibold" style={{ color: language === lang.code ? COLORS.primary : '#FFF' }}>
                  {lang.label}
                </Typography>
                {language === lang.code && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowLangModal(false)}>
              <Typography variant="button" style={{ color: '#FFF' }}>Close</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.largeRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardHeader: {
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.surfaceHighlight,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rowText: {
    color: '#FFF',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.surfaceHighlight,
  },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactInfo: {
    flex: 1,
  },
  phoneBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: SPACING.md,
    borderRadius: METRICS.baseRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  signOutText: {
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: METRICS.largeRadius,
    borderTopRightRadius: METRICS.largeRadius,
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  langOptionActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
  },
  closeModalBtn: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: METRICS.baseRadius,
  }
});

export default SettingsScreen;
