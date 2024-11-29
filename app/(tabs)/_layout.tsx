import { Tabs } from 'expo-router';
import {
  TabBarIcon,
  TabBarIcon2,
  TabBarIcon3,
} from '../../components/TabBarIcon';
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
          borderTopColor: colors.white2,
          borderTopWidth: 0,
          height: 45,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'home' : 'home', color }),
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon3({ name: focused ? 'heart-plus' : 'heart-plus', color }),
        }}
      />
      <Tabs.Screen
        name="addAnotherDog"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon2({ name: focused ? 'dog' : 'dog', color }),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'person' : 'person', color }),
        }}
      />
    </Tabs>
  );
}
