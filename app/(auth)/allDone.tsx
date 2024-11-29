import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import H2 from '../../components/H2';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Verteilt den Inhalt über den verfügbaren Platz
  },
  textContainer: {
    flex: 1, // Nimmt verfügbaren Platz ein
    justifyContent: 'center', // Ausrichtung des Textes am oberen Rand
    paddingTop: 0, // Abstand nach oben
  },
  buttonContainer: {
    paddingBottom: 20, // Abstand nach unten
  },
  button: {
    alignSelf: 'center',
    width: 332,
  },
});

export default function App() {
  return (
    <FullPageContainer>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <H1>Amazing!</H1>
          <H2>You have added a Dog to your Profile</H2>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/(tabs)" asChild>
            <Button
              style={styles.button}
              textColor={colors.text}
              mode="outlined"
            >
              Home
            </Button>
          </Link>
        </View>
      </View>
    </FullPageContainer>
  );
}
