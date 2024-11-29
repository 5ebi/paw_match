import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import { colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text2,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.white,
          borderTopWidth: 1,
          height: 50,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'home' : 'home-outline', color }),
        }}
      />
      <Tabs.Screen
        name="newGuest"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'add' : 'add-outline', color }),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'person' : 'person-outline', color }),
        }}
      />
    </Tabs>
  );
}
