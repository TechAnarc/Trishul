import { create } from 'zustand';

// Master Universal Translation Dictionary matrix natively built into Zustand memory.
// Enables instantaneous hot-reloads of deep layout text without external libraries.
const translations = {
  en: {
    // Header & Global
    greeting: 'Hey',
    active: 'Active',
    onDuty: 'On Duty',
    
    // Dashboard Stats
    todayEarnings: "TODAY'S EARNINGS",
    tripsCompleted: 'trips completed',
    vsYesterday: 'vs yesterday',
    trips: 'Trips',
    distance: 'Distance',
    drive: 'Drive',
    rating: 'Rating',
    
    // Dashboard Modules
    activeTrip: 'Active Trip',
    inProgress: 'IN PROGRESS',
    fare: 'Fare',
    quickActions: 'Quick Actions',
    startTrip: 'Start Trip',
    myTrips: 'My Trips',
    ledger: 'Ledger',
    emergency: 'Emergency',
    alerts: 'Alerts',
    
    // Settings System
    settings: 'Settings',
    appPreferences: 'App preferences',
    language: 'Language',
    theme: 'Theme',
    notifs: 'Notifications',
    locationAccess: 'Location Access',
    autoSos: 'Auto SOS',
    security: 'Security',
    emergencyContacts: 'Emergency contacts',
    adminControl: 'Admin Control',
    family: 'Family',
    signOut: 'Sign Out'
  },
  hi: {
    // Hindi (हिंदी)
    greeting: 'नमस्ते',
    active: 'सक्रिय',
    onDuty: 'ड्यूटी पर',
    todayEarnings: "आज की कमाई",
    tripsCompleted: 'यात्राएं पूरी हुईं',
    vsYesterday: 'कल की तुलना में',
    trips: 'यात्राएं',
    distance: 'दूरी',
    drive: 'ड्राइव',
    rating: 'रेटिंग',
    activeTrip: 'सक्रिय यात्रा',
    inProgress: 'प्रगति पर',
    fare: 'किराया',
    quickActions: 'त्वरित कार्रवाइयां',
    startTrip: 'यात्रा शुरू करें',
    myTrips: 'मेरी यात्रा',
    ledger: 'बहीखाता',
    emergency: 'आपातकालीन',
    alerts: 'अलर्ट',
    settings: 'सेटिंग्स',
    appPreferences: 'ऐप प्राथमिकताएं',
    language: 'भाषा (Language)',
    theme: 'थीम',
    notifs: 'सूचनाएं',
    locationAccess: 'स्थान पहुंच',
    autoSos: 'ऑटो एसओएस',
    security: 'सुरक्षा',
    emergencyContacts: 'आपातकालीन संपर्क',
    adminControl: 'एडमिन कंट्रोल',
    family: 'परिवार',
    signOut: 'लॉग आउट'
  },
  gu: {
    // Gujarati (ગુજરાતી)
    greeting: 'કેમ છો',
    active: 'સક્રિય',
    onDuty: 'ફરજ પર',
    todayEarnings: "આજની કમાણી",
    tripsCompleted: 'ટ્રિપ પૂર્ણ',
    vsYesterday: 'ગઈકાલ ની સરખામણીમાં',
    trips: 'ટ્રિપ',
    distance: 'અંતર',
    drive: 'ડ્રાઇવ',
    rating: 'રેટિંગ',
    activeTrip: 'સક્રિય ટ્રિપ',
    inProgress: 'ચાલુ છે',
    fare: 'ભાડું',
    quickActions: 'ઝડપી ક્રિયાઓ',
    startTrip: 'ટ્રિપ શરૂ કરો',
    myTrips: 'મારી ટ્રિપ',
    ledger: 'ખાતાવહી',
    emergency: 'ઇમરજન્સી',
    alerts: 'ચેતવણીઓ',
    settings: 'સેટિંગ્સ',
    appPreferences: 'એપ્લિકેશન પસંદગીઓ',
    language: 'ભાષા (Language)',
    theme: 'થીમ',
    notifs: 'સૂચનાઓ',
    locationAccess: 'સ્થાન',
    autoSos: 'ઓટો એસઓએસ',
    security: 'સુરક્ષા',
    emergencyContacts: 'ઇમરજન્સી સંપર્કો',
    adminControl: 'એડમિન કંટ્રોલ',
    family: 'પરિવાર',
    signOut: 'સાઇન આઉટ'
  },
  mr: {
    // Marathi (मराठी)
    greeting: 'नमस्कार',
    active: 'सक्रिय',
    onDuty: 'ड्युटीवर',
    todayEarnings: "आजची कमाई",
    tripsCompleted: 'ट्रिप्स पूर्ण',
    vsYesterday: 'कालच्या तुलनेत',
    trips: 'ट्रिप्स',
    distance: 'अंतर',
    drive: 'ड्रायव्हिंग',
    rating: 'रेटिंग',
    activeTrip: 'सक्रिय ट्रिप',
    inProgress: 'प्रगतीपथावर',
    fare: 'भाडे',
    quickActions: 'त्वरित कृती',
    startTrip: 'ट्रिप सुरू करा',
    myTrips: 'माझ्या ट्रिप्स',
    ledger: 'खातेवही',
    emergency: 'आणीबाणी',
    alerts: 'अॅलर्ट्स',
    settings: 'सेटिंग्ज',
    appPreferences: 'अॅप प्राधान्ये',
    language: 'भाषा (Language)',
    theme: 'थीम',
    notifs: 'सूचना',
    locationAccess: 'स्थान प्रवेश',
    autoSos: 'ऑटो एसओएस',
    security: 'सुरक्षा',
    emergencyContacts: 'आणीबाणी संपर्क',
    adminControl: 'अॅडमिन कंट्रोल',
    family: 'कुटुंब',
    signOut: 'साइन आउट'
  }
};

export type LanguageCode = keyof typeof translations;
export const SUPPORTED_LANGUAGES: { code: LanguageCode, label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'mr', label: 'मराठी (Marathi)' }
];

interface I18nState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  // Core translation execution function bound to active state
  t: (key: keyof typeof translations['en']) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: 'en', // default
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    // Fallback safely to English if key missing in translation target.
    return translations[lang][key] || translations['en'][key] || key;
  }
}));
