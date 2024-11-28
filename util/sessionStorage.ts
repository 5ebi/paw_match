// util/sessionStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sessionStorage = {
  setSession: (token: string) => AsyncStorage.setItem('sessionToken', token),
  getSession: () => AsyncStorage.getItem('sessionToken'),
  clearSession: () => AsyncStorage.removeItem('sessionToken'),
};
