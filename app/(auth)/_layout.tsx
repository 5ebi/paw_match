import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="registerEmail" />
      <Stack.Screen name="registerVerify" />
      <Stack.Screen name="registerName" />
      <Stack.Screen name="registerPostalCode" />
      <Stack.Screen name="registerPassword" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="allDone" />
    </Stack>
  );
}
