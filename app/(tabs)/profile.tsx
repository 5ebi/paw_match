import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import H1 from '../../components/H1';
import H2 from '../../components/H2';
import Textt from '../../components/Textt';
import Textt2 from '../../components/Textt2';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

interface Dog {
  id: number;
  name: string;
  image: string;
  size: string;
  activityLevel: string;
  birthDate: string;
}

const ELEMENT_WIDTH = 330;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 10,
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
  boldText: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dogsSection: {
    width: ELEMENT_WIDTH,
    marginTop: 20,
  },
  emailText: {
    marginBottom: 15,
    color: colors.text,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.white2,
    height: 150,
    flexDirection: 'row',
    borderRadius: 20,
  },
  cardImage: {
    width: 150,
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dogName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  dogDetail: {
    color: colors.black,
    marginVertical: 5,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'semibold',
    opacity: 0.8,
  },
});

export default function Profile() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDogs, setUserDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await sessionStorage.getSession();
        if (!token) throw new Error('No session found');

        const response = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error || 'Failed to fetch user data');
        }

        const { name, email, dogs } = await response.json();
        setUserName(name);
        setUserEmail(email);
        setUserDogs(dogs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred.',
        );
      }
    };

    fetchUser().catch((err) => console.error('Fetch user failed:', err));
  }, []);

  const handleLogout = async () => {
    try {
      const token = await sessionStorage.getSession();
      if (token) {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) console.error('Server logout failed');
      }
      await sessionStorage.clearSession();
      router.replace('/(auth)/welcome');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: colors.green,
      }}
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <H1>Profile</H1>
          {error ? (
            <Textt style={styles.errorText}>{error}</Textt>
          ) : (
            <View>
              <Textt
                style={{ fontSize: 26, textAlign: 'left', marginBottom: 20 }}
              >
                {userName || 'Loading...'}
              </Textt>

              <Textt2 style={styles.emailText}>
                <Textt2 style={{ ...styles.boldText, color: colors.text }}>
                  Your email:{' '}
                </Textt2>

                <Textt2>{userEmail || 'Loading...'}</Textt2>
              </Textt2>
              <View style={styles.dogsSection}>
                <H2>My Dogs</H2>

                {userDogs.map((dog) => (
                  <View key={`dog-${dog.id}`} style={styles.card}>
                    <Image
                      source={{ uri: dog.image }}
                      style={styles.cardImage}
                    />
                    <View
                      style={[
                        styles.cardContent,
                        { backgroundColor: colors.white2 },
                      ]}
                    >
                      <Text style={styles.dogName}>{dog.name || 'Name'}</Text>
                      <Text style={styles.dogDetail}>
                        Size: {dog.size || 'Unknown'}
                      </Text>
                      <Text style={styles.dogDetail}>
                        Activity: {dog.activityLevel || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <Button mode="contained" onPress={handleLogout} style={styles.button}>
            Logout
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
