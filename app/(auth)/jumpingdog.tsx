// import { StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

// import Rive from 'rive-react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// function Jumpingdog() {
//   return (
//     <Rive
//       url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
//       artboardName="Avatar 1"
//       stateMachineName="avatar"
//       style={{ width: 400, height: 400 }}
//     />
//   );
// }

export default function App() {
  return (
    <FullPageContainer>
      <H1>Dancing dog</H1>

      <Link href="/(tabs)" asChild>
        <Button
          style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
          textColor={colors.text}
          mode="outlined"
        >
          Add
        </Button>
      </Link>
      {/* <View style={styles.container}> */}
      {/* <Jumpingdog /> */}
      {/* </View> */}
    </FullPageContainer>
  );
}
