import {
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import React from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  base: {
    color: colors.white,
    marginBottom: 5,
    textAlign: 'center',
  },
});

type TexttProps = {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'bold' | 'semibold';
};

export default function Textt({ children, style, variant = 'bold' }: TexttProps) {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const fontFamily = variant === 'bold' ? 'Montserrat_700Bold' : 'Montserrat_600SemiBold';
  const fontWeight = variant === 'bold' ? 'bold' : '600';

  return (
    <Text style={[styles.base, { fontFamily, fontWeight }, style]}>
      {children}
    </Text>
  );
}
