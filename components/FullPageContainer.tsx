import React from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../constants/colors';

type FullPageContainerProps = {
  children: React.ReactNode;
  dismissKeyboard?: boolean; // Optional prop falls Sie die Funktionalität manchmal deaktivieren möchten
};

export default function FullPageContainer({
  children,
  dismissKeyboard = true, // Standardmäßig aktiviert
}: FullPageContainerProps) {
  const content = (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </SafeAreaView>
  );

  // Wenn dismissKeyboard true ist, wrappen wir den Content mit TouchableWithoutFeedback
  if (dismissKeyboard) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  // Ansonsten geben wir den normalen Content zurück
  return content;
}
