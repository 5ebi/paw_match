import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView>
        <Text>Settings</Text>
      </SafeAreaView>
    </>
  );
}
