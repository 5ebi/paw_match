import React from 'react';
import type { ViewStyle } from 'react-native'; // Use `import type`
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between', // Align top and bottom sections
    paddingHorizontal: 20, // Add padding on the sides
    paddingVertical: 20,
  },
});

type FullPageContainerProps = {
  children: React.ReactNode; // Content inside the container
  style?: ViewStyle; // Optional additional styles
};

export default function FullPageContainer({
  children,
  style,
}: FullPageContainerProps) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}
