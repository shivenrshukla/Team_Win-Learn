import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Bell, Menu as MenuIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type HeaderBarProps = {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showMenu?: boolean;
  transparent?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBack = false,
  showSearch = false,
  showNotification = false,
  showMenu = false,
  transparent = false,
  onSearchPress,
  onNotificationPress,
  onMenuPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();

  const headerStyle = {
    backgroundColor: transparent ? 'transparent' : colors.background,
    borderBottomColor: transparent ? 'transparent' : colors.border,
  };

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, headerStyle, { paddingTop: statusBarHeight }]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={24}
              color={transparent ? '#FFFFFF' : colors.text}
            />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
          >
            <MenuIcon
              size={24}
              color={transparent ? '#FFFFFF' : colors.text}
            />
          </TouchableOpacity>
        )}
        {title && (
          <Text
            style={[
              styles.title,
              { color: transparent ? '#FFFFFF' : colors.text },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
          >
            <Search
              size={22}
              color={transparent ? '#FFFFFF' : colors.text}
            />
          </TouchableOpacity>
        )}
        {showNotification && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <Bell
              size={22}
              color={transparent ? '#FFFFFF' : colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 88, // Includes status bar height
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
    marginHorizontal: 4,
  },
});

export default HeaderBar;