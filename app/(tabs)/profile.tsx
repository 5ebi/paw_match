import { router } from 'expo-router';
import * as React from 'react';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Profile() {
  const [isLongPressed, setIsLongPressed] = React.useState(false);

  return (
    <SafeAreaView>
      <H1>Profile</H1>

      <Button
        mode="elevated"
        compact={true}
        onPress={() => router.push('/settings')}
        onLongPress={() => setIsLongPressed(true)} // Background changes on long press
        onPressOut={() => setIsLongPressed(false)} // Reset when button is released
        style={{
          alignSelf: 'center',
          marginTop: 10,
          backgroundColor: isLongPressed ? colors.black : 'white', // Dynamic background color
        }}
      >
        Change your settings
      </Button>

      <Button
        mode="elevated"
        compact={true}
        onPress={() => router.push('/welcome')}
        buttonColor="red"
        textColor={colors.black}
        style={{
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        LOG OUT
      </Button>
    </SafeAreaView>
  );
}
