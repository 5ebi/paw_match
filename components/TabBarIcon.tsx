import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type ComponentProps } from 'react';

export function TabBarIcon({
  style,
  color,
  name,
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return (
    <Ionicons
      size={30}
      style={[{ marginBottom: -3, fontFamily: 'Poppins_400Regular' }, style]}
      color={color}
      name={name}
    />
  );
}

export function TabBarIcon2({
  style,
  color,
  name,
}: IconProps<ComponentProps<typeof FontAwesome6>['name']>) {
  return (
    <FontAwesome6
      size={30}
      style={[{ marginBottom: -3, width: 40 }, style]}
      color={color}
      name={name}
    />
  );
}

export function TabBarIcon3({
  style,
  color,
  name,
}: IconProps<ComponentProps<typeof MaterialCommunityIcons>['name']>) {
  return (
    <MaterialCommunityIcons
      size={30}
      style={[{ marginBottom: -3 }, style]}
      color={color}
      name={name}
    />
  );
}
