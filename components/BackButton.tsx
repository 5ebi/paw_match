// components/BackButton.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { colors } from '../constants/colors';

interface BackButtonProps {
  size?: number;
  onPress?: () => void;
  style?: object;
}

const BackButton: React.FC<BackButtonProps> = ({
  size = 32,
  onPress,
  style,
}) => {
  const router = useRouter();
  const styles = StyleSheet.create({
    backButton: {
      position: 'absolute',
      top: 0,
      left: -10,
      zIndex: 1,
    },
  });

  return (
    <IconButton
      icon="arrow-left"
      iconColor={colors.white2}
      size={size}
      style={[styles.backButton, style]}
      onPress={onPress || (() => router.back())}
    />
  );
};

export default BackButton;
