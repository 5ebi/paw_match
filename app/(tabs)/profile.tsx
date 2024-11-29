import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import Textt from '../../components/Textt';
import Textt2 from '../../components/Textt2';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

const ELEMENT_WIDTH = 330;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    width: ELEMENT_WIDTH,
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: ELEMENT_WIDTH,
    padding: 3,
    marginBottom: 10,
    backgroundColor: colors.red,
  },
  userInfoText: {
    marginBottom: 5,
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    paddingBottom: 20,
  },
  emailText: {
    marginBottom: 15,
    color: colors.text,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

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

    fetchUser().catch((err) => console.error('Fetch user failed:', err));
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      const token = await sessionStorage.getSession();
      if (token) {
        // Erst die Server-Session löschen
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Server logout failed');
        }
      }
      await sessionStorage.clearSession(); // Clear local session
      router.replace('/(auth)/welcome');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FullPageContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}
        >
          <View style={styles.container}>
            {/* <BackButton /> */}

            <View style={styles.topSection}>
              <H1>Profile</H1>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <View>
                  <Textt style={{ fontSize: 26 }}>
                    Hi {userName || 'Loading...'}
                  </Textt>

                  <Textt2 style={styles.emailText}>
                    <Textt2 style={styles.boldText}>Your current email:</Textt2>
                    {userEmail || 'Loading...'}
                  </Textt2>
                </View>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
              >
                Logout
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </FullPageContainer>
    </>
  );
}
