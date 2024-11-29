import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

export default function Profile() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await sessionStorage.getSession(); // Get session token
        if (!token) throw new Error('No session found');

        const response = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch user data');
        }

        const { name, email } = await response.json();
        setUserName(name);
        setUserEmail(email);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    // Promise auflösen oder behandeln
    fetchUser().catch((err) => console.error('Fetch user failed:', err));
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await sessionStorage.clearSession(); // Clear local session
      router.replace('/(auth)/welcome');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <FullPageContainer>
      <H1>Profile</H1>
      {error ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
      ) : (
        <View>
          <Text style={{ marginBottom: 5, color: colors.text }}>
            <Text style={{ fontWeight: 'bold' }}>Name:</Text>{' '}
            {userName || 'Loading...'}
          </Text>
          <Text style={{ marginBottom: 15, color: colors.text }}>
            <Text style={{ fontWeight: 'bold' }}>Email:</Text>{' '}
            {userEmail || 'Loading...'}
          </Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleLogout}
        style={{
          alignSelf: 'center',
          marginTop: 10,
          backgroundColor: colors.text,
        }}
      >
        Logout
      </Button>
    </FullPageContainer>
  );
}
