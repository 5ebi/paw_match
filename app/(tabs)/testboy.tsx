import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    width: '100%',

    justifyContent: 'center',
  },
  image: {
    width: 400, // Set the width of the image
    height: 400, // Set the height of the image
    resizeMode: 'contain', // Adjust how the image is scaled
  },
});

export default function Testboy() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://cdn.dotpe.in/longtail/item_thumbnails/7562157/uIQW1G8c-400-400.webp',
          }} // Replace with your image URL
        />
        <Text style={{ fontFamily: 'Montserrat_500Medium' }}>
          hi whats up Fro
        </Text>
      </View>
    </SafeAreaView>
  );
}
