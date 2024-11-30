import { Montserrat_900Black, useFonts } from '@expo-google-fonts/montserrat';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  H2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white2,
    marginBottom: 20,
    textAlign: 'center', // Centers the text
    fontFamily: 'Montserrat_900Black',
  },
});

type H2Props = {
  children: React.ReactNode; // The content to be displayed
};

export default function H2({ children }: H2Props) {
  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }
  return <Text style={[styles.H2]}>{children}</Text>;
}
