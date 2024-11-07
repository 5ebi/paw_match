import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    alignContent: 'center',
    color: colors.blackBean,
    fontWeight: 500,
    marginBottom: 10,
  },

  card: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 40,
    width: 300,
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

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {first} {last}
      </Text>
    </View>
  );
}
