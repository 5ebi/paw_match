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
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { colors } from '../constants/colors';
import { darkTheme, lightTheme } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  view: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight + 20,
    paddingBottom: 0,
  },
});

export default function HomeLayout() {
  const colorScheme = useColorScheme(); // Returns 'light' or 'dark'

  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // State to manage readiness
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real login logic

  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Modak_400Regular,
  });

  // Prevent the splash screen from hiding automatically
  useEffect(() => {
    async function setupSplashScreen() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (error) {
        console.warn('Error preventing splash screen auto-hide:', error);
      }
    }

    setupSplashScreen().catch((error) => {
      console.error('Unhandled error in setupSplashScreen:', error);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Simulate checking login state
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 1000); // Correctly handle the timeout
        });

        setIsLoggedIn(false); // Replace with actual login logic

        if (fontsLoaded) {
          setIsReady(true);
        }
      } catch (error) {
        console.warn('Error during preparation:', error);
      }
    })().catch((error) => {
      console.error('Unhandled promise in preparation:', error);
    });
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      if (isReady) {
        try {
          await SplashScreen.hideAsync();
          if (isLoggedIn) {
            await router.replace('/(tabs)'); // Redirect to logged-in screen
          } else {
            await router.replace('/(auth)/welcome'); // Redirect to welcome screen
          }
        } catch (error) {
          console.warn('Error during splash screen or routing:', error);
        }
      }
    })().catch((error) => {
      console.error('Unhandled promise in splash screen routing:', error);
    });
  }, [isReady, isLoggedIn, router]);

  if (!isReady) {
    return null; // Return nothing while splash screen is visible
  }

  return (
    <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.view}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(files)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
