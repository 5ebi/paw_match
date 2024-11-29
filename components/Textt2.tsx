import {
  Montserrat_600SemiBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import React from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  Textt2: {
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
    // fontSize kann hier weggelassen werden oder als Standardwert festgelegt werden
  },
});

type Textt2Props = {
  children: React.ReactNode;
  style?: TextStyle; // Optionales style Prop hinzufügen
};

export default function Textt2({ children, style }: Textt2Props) {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return <Text style={[styles.Textt2, style]}>{children}</Text>;
}
