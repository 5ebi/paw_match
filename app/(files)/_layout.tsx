import { Stack } from 'expo-router';

export default function FilesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
    </Stack>
  );
}
