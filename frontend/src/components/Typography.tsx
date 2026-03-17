import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof TYPOGRAPHY;
  color?: keyof typeof COLORS;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'text',
  align = 'left',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        TYPOGRAPHY[variant],
        { color: COLORS[color], textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typography;
