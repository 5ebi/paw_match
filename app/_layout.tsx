import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
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
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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
    initializeApp();
  }, []);

  // Routing basierend auf Login-Status
  useEffect(() => {
    if (isLoggedIn === true) {
      router.replace('/(tabs)');
    } else if (isLoggedIn === false) {
      router.replace('/(auth)/welcome');
    }
  }, [isLoggedIn, router]);

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
