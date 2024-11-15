import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Register() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const handleSubmit = async () => {
  //   const userData = { name, email };

  //   // Sende die E-Mail und den Namen an den Server (ohne Passwort und Postleitzahl)
  //   try {
  //     const response = await fetch('http://localhost:3000/register', {
  //       // Update mit deinem Server-URL
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('User created:', data);
  //       // Weiterleitung zur E-Mail-Verifikation oder einer nächsten Seite
  //     } else {
  //       console.error('Failed to register:', await response.text());
  //     }
  //   } catch (error) {
  //     console.error('Error sending data:', error);
  //   }
  // };

  return (
    <FullPageContainer>
      <H1>Register</H1>

      {/* <TextInput value={name} onChangeText={(text) => setName(text)} />
      <TextInput value={email} onChangeText={(text) => setEmail(text)} /> */}

      <Link href="/verify" asChild>
        <Button
          // onPress={handleSubmit}
          style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
          textColor={colors.text}
          mode="outlined"
        >
          Sign Up
        </Button>
      </Link>
    </FullPageContainer>
  );
}
