import { useFonts } from '@expo-google-fonts/modak';
import {
  Montserrat_400Regular as MontserratRegular,
  Montserrat_600SemiBold as MontserratSemiBold,
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
    flexWrap: 'wrap',
    maxWidth: 300,
  },
  baseText: {
    fontSize: 20,
    color: colors.white4,
    opacity: 1,
  },
  normalText: {
    fontFamily: 'Montserrat_400Regular',
  },
  emphasizedText: {
    fontFamily: 'Montserrat_600SemiBold',
  },
});

export default function Slogan() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular: MontserratRegular,
    Montserrat_600SemiBold: MontserratSemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.baseText, styles.normalText]}>find the </Text>
      <Text style={[styles.baseText, styles.emphasizedText]}>pawfect </Text>

      <Text style={[styles.baseText, styles.normalText]}>match</Text>
    </View>
  );
}
