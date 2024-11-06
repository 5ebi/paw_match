import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: colors.blackBean,
    fontWeight: 500,
    marginBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 30,
    width: 300,
  },
});

type Props = {
  user: {
    firstName: string;
    lastName: string;
  };
};
export default function UserItem({ user }: Props) {
  const { firstName, lastName } = user;

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {' '}
        {firstName} {lastName}
      </Text>
    </View>
  );
}
