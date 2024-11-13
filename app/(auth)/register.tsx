import { Link } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Register() {
  return (
    <SafeAreaView>
      <H1>Register</H1>

      <Link href="/(tabs)/newGuest" asChild>
        <Button
          style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
          textColor={colors.text}
          mode="outlined"
        >
          Sign Up
        </Button>
      </Link>
    </SafeAreaView>
  );
}
