import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <Text>Settings</Text>
    </SafeAreaView>
  );
}
