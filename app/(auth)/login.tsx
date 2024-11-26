import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Verhindere doppelte Einreichung
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setError('');
        console.log('Login erfolgreich:', data);

        // Weiterleitung zu einer geschützten Seite oder Home
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login fehlgeschlagen');
      }
    } catch {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullPageContainer>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: -30,
          left: -40,
          width: 100,
          height: 100,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton icon="arrow-left" iconColor="black" size={30} />
      </TouchableOpacity>

      <H1>Log in</H1>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ marginBottom: 10 }}
        keyboardType="email-address"
      />
      <TextInput
        label="Passwort"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ marginBottom: 10 }}
        secureTextEntry
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        onPress={handleSubmit}
        style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
        textColor={colors.text}
        mode="outlined"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Log In'}
      </Button>
    </FullPageContainer>
  );
}
