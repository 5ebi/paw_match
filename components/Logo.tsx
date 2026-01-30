import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  Logo: {
    fontSize: 60,
    color: colors.white3,
    textAlign: 'center',
    fontFamily: 'Modak_400Regular',
  },
});

type LogoProps = {
  children: React.ReactNode;
};

export default function Logo({ children }: LogoProps) {
  return <Text style={[styles.Logo]}>{children}</Text>;
}
