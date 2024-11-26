import { Modak_400Regular, useFonts } from '@expo-google-fonts/modak';
import {
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
} from '@expo-google-fonts/montserrat';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  Slogan: {
    fontSize: 20,
    marginTop: -10,
    color: colors.black2,
    opacity: 0.8,

    textAlign: 'center', // Centers the text
    fontFamily: 'Montserrat_600SemiBold_Italic',
  },
});

type LogoProps = {
  children: React.ReactNode; // The content to be displayed
};

export default function Slogan({ children }: LogoProps) {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }
  return <Text style={[styles.Slogan]}>{children}</Text>;
}
