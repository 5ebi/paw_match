import { Modak_400Regular } from '@expo-google-fonts/modak';
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Slogan from '../../components/Slogan';
// import UserItem from '../../components/UserItem';
import { colors } from '../../constants/colors';

const App = () => {
  const [fontsLoaded] = useFonts({
    Modak_400Regular,
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    h2: {
      color: colors.h2,
      fontFamily: 'Montserrat_700Bold',
      fontWeight: 700,
      margin: 10,
      fontSize: 20,
      paddingLeft: 20,
      paddingRight: 20,
      letterSpacing: 2,
      lineHeight: 80,
      textAlign: 'center',
    },
    h1: {
      color: colors.h1,
      fontFamily: 'Modak_400Regular',
      fontSize: 60,
      letterSpacing: 1,
      textAlign: 'center',
      marginVertical: 35,
    },
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[styles.h1, { marginBottom: 0, marginTop: 0 }]}>
          PawMatch
        </Text>
        <Slogan>find the pawfect match.</Slogan>
        {/* <Text style={[styles.h2, { marginBottom: 10, marginTop: 0 }]}>
          Find the Pawfect Match!
        </Text> */}
      </View>
      <Button
        mode="contained"
        onPress={() => router.push('/match')}
        style={{
          alignSelf: 'center',
          marginTop: 10,
          backgroundColor: colors.white,
        }}
      >
        Find a Match
      </Button>
      <StatusBar style="dark" hidden={false} />
    </SafeAreaView>
  );
};

export default App;
