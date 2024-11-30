import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

interface MatchResponse {
  matches: MatchedDog[];
}

interface MatchedDog {
  dog: {
    id: number;
    name: string;
    size: string;
    activityLevel: string;
    birthDate: string;
  };
  score: number;
  matches: {
    size: boolean;
    age: boolean;
    activityLevel: boolean;
    preferences: boolean;
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.green,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  matchDetail: {
    color: colors.white2,
    marginVertical: 5,
  },
  noMatches: {
    textAlign: 'center',
    color: colors.white,
    marginTop: 20,
    fontSize: 40,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default function Matches() {
  const [matches, setMatches] = useState<MatchedDog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = await sessionStorage.getSession();
        const response = await fetch('/api/matches', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as MatchResponse;
        setMatches(data.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches().catch((error) => {
      console.error('Failed to fetch matches:', error);
    });
  }, []);

  if (loading) {
    return (
      <FullPageContainer>
        <Text>Loading...</Text>
      </FullPageContainer>
    );
  }

  return (
    <FullPageContainer>
      <ScrollView style={styles.container}>
        <H1>Match</H1>
        {matches.length > 0 ? (
          matches.map((match) => (
            <Card key={`dog-${match.dog.id}`} style={styles.card}>
              <Card.Content>
                <Text style={styles.score}>Match Score: {match.score}/10</Text>
                <Text style={styles.matchDetail}>Name: {match.dog.name}</Text>
                <Text style={styles.matchDetail}>Size: {match.dog.size}</Text>
                <Text style={styles.matchDetail}>
                  Activity: {match.dog.activityLevel}
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noMatches}>No matches found in your area :(</Text>
        )}
      </ScrollView>
    </FullPageContainer>
  );
}
