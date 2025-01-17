import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    height: '100%',
  },
});

type FullPageContainerProps = {
  children: React.ReactNode;
  dismissKeyboard?: boolean;
};

export default function FullPageContainer({
  children,
  dismissKeyboard = true,
}: FullPageContainerProps) {
  const content = (
    <SafeAreaView style={styles.container}>{children}</SafeAreaView>
  );

  return dismissKeyboard ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  ) : (
    content
  );
}
