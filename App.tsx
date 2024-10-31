import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cd0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    margin: 10,
    fontSize: 40,
    paddingLeft: 20,
    paddingRight: 20,
    letterSpacing: 2,
    lineHeight: 80,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { marginBottom: 40 }]}>
        This is my first expo project!
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}
