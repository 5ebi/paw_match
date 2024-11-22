import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Hook for navigation

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);
    const userData = { email, password, name };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setError('');
        console.log('User registered successfully:', data);

        // Navigate to the verification page
        router.push('/verify');
      } else {
        const errorData: { error?: string } = await response.json();
        setError(errorData.error || 'Registration failed');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <FullPageContainer>
      <IconButton
        icon="arrow-left"
        iconColor="black"
        size={28}
        onPress={() => router.back()}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 10,
          position: 'absolute',
          zIndex: 1,
          opacity: 0.8,
          top: 10,
          left: 10,
        }}
      />

      <H1>Register</H1>

      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ marginBottom: 10 }}
        secureTextEntry
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {success && (
        <Text style={{ color: 'green' }}>Registration successful!</Text>
      )}

      <Button
        onPress={handleSubmit}
        style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
        textColor={colors.text}
        mode="outlined"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Sign Up'}
      </Button>
    </FullPageContainer>
  );
}
