import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme';

interface SafeViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeView: React.FC<SafeViewProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Applies new theme background
  },
});

export default SafeView;
