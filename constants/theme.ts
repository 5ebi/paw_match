import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'white',
    onPrimary: 'black',
    background: 'rgb(253, 253, 245)',
    onBackground: 'rgb(26, 28, 24)',
    surface: 'rgb(253, 253, 245)',
    onSurface: 'rgb(26, 28, 24)',
  },
  roundness: 8,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'rgb(163, 213, 120)',
    onPrimary: 'rgb(26, 55, 0)',
    background: 'rgb(26, 28, 24)',
    onBackground: 'rgb(227, 227, 220)',
    surface: 'rgb(26, 28, 24)',
    onSurface: 'rgb(227, 227, 220)',
  },
  roundness: 8,
};
