import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import H2 from '../../components/H2';
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
    image: string | null;
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
    backgroundColor: colors.green,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.white2,
    height: 450,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  doggy: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 5,
  },
  matchDetail: {
    color: colors.black,
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMatches: {
    textAlign: 'center',
    color: colors.black,
    marginTop: 20,
    fontSize: 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cardImage: {
    height: 300,
    // width: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,

    backgroundColor: colors.white,
    // alignSelf: 'center',
    // alignContent: 'center',
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <H1>Match</H1>
      <H2>find matching Dogs below</H2>
      {matches.length > 0 ? ( // Optional chaining hinzugefügt
        matches.map((match) => (
          <Card key={`dog-${match.dog.id}`} style={styles.card}>
            {match.dog.image && (
              <Card.Cover
                source={{ uri: match.dog.image }}
                style={styles.cardImage} // Neuer Style
              />
            )}
            <Card.Content>
              <Text style={styles.doggy}>{match.dog.name}</Text>
              <Text style={styles.matchDetail}>Size: {match.dog.size}</Text>
              <Text style={styles.matchDetail}>
                Activity: {match.dog.activityLevel}
              </Text>
              <Text style={styles.matchDetail}>
                Match Score: {match.score}/10
              </Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noMatches}>No matches found in your area :(</Text>
      )}
    </ScrollView>
  );
}
