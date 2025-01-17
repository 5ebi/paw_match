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
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import BackgroundSvg from '../../components/BackgroundSvg';
import Logo from '../../components/Logo';
import Slogan from '../../components/Slogan';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

interface HasDogResponse {
  hasDog: boolean;
  error?: string;
}

const App = () => {
  const [hasDog, setHasDog] = useState<boolean | null>(null);
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

  useEffect(() => {
    const checkDog = async () => {
      try {
        const token = await sessionStorage.getSession();
        const response = await fetch('/api/hasDog', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json()) as HasDogResponse;
        setHasDog(data.hasDog);
      } catch (error) {
        console.error('Error checking dog:', error);
      }
    };

    checkDog().catch(console.error);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
    },
    backgroundSvg: {
      position: 'absolute',
      top: -50,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.5,
      zIndex: 1,
    },
    container2: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      // justifyContent: 'space-between',
    },
    h2: {
      color: colors.h2,
      fontFamily: 'Montserrat_700Bold',
      fontWeight: '700',
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
    button: {
      alignSelf: 'center',
      marginTop: 'auto',
      backgroundColor: colors.white,
      width: 330,
      zIndex: 2,
      marginBottom: 30,
      padding: 3,
    },
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Logo>PawMatch</Logo>
        <Slogan />
      </View>
      <BackgroundSvg style={styles.backgroundSvg} />
      <View style={styles.container2}>
        {hasDog ? (
          <Button
            mode="contained"
            onPress={() => router.push('/match')}
            style={styles.button}
          >
            Find a Match
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => router.push('/addAnotherDog')}
            style={styles.button}
          >
            Add your dog here
          </Button>
        )}
      </View>
      <StatusBar style="dark" hidden={false} />
    </SafeAreaView>
  );
};

export default App;
