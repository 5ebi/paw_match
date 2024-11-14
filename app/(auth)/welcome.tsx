import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import Logo from '../../components/Logo';
import Slogan from '../../components/Slogan';
import { colors } from '../../constants/colors';

export default function Welcome() {
  const styles = StyleSheet.create({
    logoContainer: {
      flex: 1, // Takes up available vertical space
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsContainer: {
      paddingBottom: 20, // Adds some spacing from the bottom
    },
    button: {
      alignSelf: 'center',
      width: 332,
      marginBottom: 10,
    },
  });

  return (
    <FullPageContainer>
      {/* Content at the top or center */}
      <View style={styles.logoContainer}>
        <Logo>Paw Match</Logo>
        <Slogan>find the pawfect match</Slogan>
      </View>

      {/* Buttons at the bottom */}
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          textColor={colors.text}
          mode="outlined"
          onPress={() => router.push('/(auth)/register')}
        >
          Sign Up
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push('/(auth)/login')}
        >
          I already have an account
        </Button>
      </View>
    </FullPageContainer>
  );
}

// export default function Welcome() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Welcome</Text>
//       <Button title="Login" onPress={() => router.push('/(auth)/login')} />
//       <Button
//         title="Register"
//         onPress={() => router.push('/(auth)/register')}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });
