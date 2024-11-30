import { Modak_400Regular, useFonts } from '@expo-google-fonts/modak';
import {
  Montserrat_400Regular_Italic,
  Montserrat_400Regular_Italic as MontserratItalic,
  Montserrat_600SemiBold_Italic,
} from '@expo-google-fonts/montserrat';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
  },
  baseText: {
    fontSize: 20,
    color: colors.white4,
    opacity: 1,
  },
  italicText: {
    fontFamily: 'Montserrat_400Regular_Italic',
  },
  emphasizedText: {
    fontFamily: 'Montserrat_600SemiBold_Italic',
  },
});

export default function Slogan() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular_Italic: MontserratItalic,
    Montserrat_600SemiBold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.baseText, styles.italicText]}>find the </Text>
      <Text style={[styles.baseText, styles.emphasizedText]}>pawfect </Text>

      <Text style={[styles.baseText, styles.italicText]}>match.</Text>
    </View>
  );
}
