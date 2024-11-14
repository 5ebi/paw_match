import {
  Montserrat_600SemiBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',

    justifyContent: 'center',
    color: colors.black2,
    fontWeight: '500',
    marginBottom: 10,
    textAlignVertical: 'center',
  },

  card: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    height: 50,
    width: 300,
    justifyContent: 'center',
  },
});

type Props = {
  user: {
    name: {
      first: string;
      last: string;
    };
  };
};
export default function UserItem({ user }: Props) {
  const { first, last } = user.name;

  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {first} {last}
      </Text>
    </View>
  );
}
