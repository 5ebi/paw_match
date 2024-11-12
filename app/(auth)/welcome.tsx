import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Logo from '../../components/Logo';
import { colors } from '../../constants/colors';

export default function Welcome() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    h2: {
      color: colors.h2,
      fontFamily: 'Montserrat_700Bold',
      fontWeight: 700,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <Logo>Paw Match</Logo>
      <Text>Hello and welcome to Dog Match!</Text>

      <Button
        style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
        textColor={colors.text}
        mode="outlined"
        onPress={() => router.push('/(auth)/register')}
      >
        Sign Up
      </Button>

      <Button
        style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
        mode="contained"
        onPress={() => router.push('/(auth)/login')}
      >
        I already have an account
      </Button>
    </SafeAreaView>
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
