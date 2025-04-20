import { Tabs } from 'expo-router';
import { View, StyleSheet, useColorScheme, Image } from 'react-native';
import { Chrome as Home, Book, Heart, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const tabBarStyle = {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
  };

  const getTabBarVisibility = (routeName: string): boolean => {
    return !(routeName === 'manga/[id]' || routeName === 'manga/read/[id]/[chapter]');
  };
  // inside TabLayout component
const scheme = useColorScheme();

const getIcon = (lightIcon: any, darkIcon: any) => {
  return scheme === 'dark' ? darkIcon : lightIcon;
};


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: tabBarStyle,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Book color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
      {/* Conditional tab bar visibility for manga/read/[id]/[chapter] */}
      <Tabs.Screen
        name="manga/read/[id]/[chapter]"
        options={({ route }) => ({
          title: 'Resume reading',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size }}>
              <Image
          source={
            getIcon(
              require('../../assets/images/book_light.png'),
              require('../../assets/images/book_dark.png')
            )
          }
          style={{ width: '100%', height: '100%' }}
          />
            </View>
          ),
          tabBarStyle: getTabBarVisibility(route.name) ? tabBarStyle : { display: 'none' },
        })}
      />
      <Tabs.Screen
        name="manga/[id]"
        options={({ route }) => ({
          title: 'Read Manga',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size }}>
              <Image
          source={
            getIcon(
              require('../../assets/images/m_light.png'),
              require('../../assets/images/m_dark.png')
            )
          }
          style={{ width: '100%', height: '100%' }}
          />
            </View>
          )
        })}
      />
    </Tabs>
  );
}
