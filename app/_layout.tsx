import Constants from 'expo-constants';
import { Modak_400Regular, useFonts } from '@expo-google-fonts/modak';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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
import { sessionStorage } from '../util/sessionStorage';

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
  const colorScheme = useColorScheme(); // This is the correct way to get the color scheme
  const router = useRouter();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({
    Modak_400Regular,
  });

  // Session beim App-Start prüfen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await sessionStorage.getSession();
        setIsLoggedIn(!!token);
      } catch (error) {
        console.warn('Error during initialization:', error);
        setIsLoggedIn(false);
      }
    };
    initializeApp().catch((error) => {
      console.error('Initialization failed:', error);
      setIsLoggedIn(false);
    });
  }, []);

  // Routing basierend auf Login-Status
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (isLoggedIn === true && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }

    if (isLoggedIn === false && inTabsGroup) {
      router.replace('/(auth)/welcome');
    }
  }, [isLoggedIn, router, segments]);

  return (
    <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {fontsLoaded && (
          <View style={styles.view}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(files)" options={{ headerShown: false }} />
            </Stack>
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}
