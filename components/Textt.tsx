// Textt.tsx
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
  Textt: {
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
    // fontSize kann hier weggelassen werden oder als Standardwert festgelegt werden
  },
});

type TexttProps = {
  children: React.ReactNode;
  style?: TextStyle; // Optionales style Prop hinzufügen
};

export default function Textt({ children, style }: TexttProps) {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return <Text style={[styles.Textt, style]}>{children}</Text>;
}
