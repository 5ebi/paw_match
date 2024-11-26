import React from 'react';
import { SafeAreaView } from 'react-native';
import { colors } from '../constants/colors';

type FullPageContainerProps = {
  children: React.ReactNode;
};

export default function FullPageContainer({
  children,
}: FullPageContainerProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </SafeAreaView>
  );
}
