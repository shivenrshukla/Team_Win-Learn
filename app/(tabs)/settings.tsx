import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun, Download, Wifi, Eye, Bell, Info, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';
import Colors from '@/constants/Colors';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
};

type SettingsItemProps = {
  icon: React.ReactNode;
  title: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
};

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  value,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <TouchableOpacity
      style={[styles.settingsItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingsItemLeft}>
        {icon}
        <Text style={[styles.settingsItemTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.settingsItemRight}>
        {isSwitch ? (
          <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.border}
            onValueChange={onSwitchChange}
            value={switchValue}
          />
        ) : (
          <>
            {value && (
              <Text style={[styles.settingsItemValue, { color: colors.secondaryText }]}>
                {value}
              </Text>
            )}
            <ChevronRight size={20} color={colors.secondaryText} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [wifiOnly, setWifiOnly] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Settings" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsSection title="APPEARANCE">
          <SettingsItem
            icon={darkMode ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.warning} />}
            title="Dark Mode"
            isSwitch
            switchValue={darkMode}
            onSwitchChange={(value) => setDarkMode(value)}
          />
          <SettingsItem
            icon={<Eye size={22} color={colors.secondary} />}
            title="Reading Mode"
            value="Horizontal"
            onPress={() => {}}
          />
        </SettingsSection>
        
        <SettingsSection title="DATA & STORAGE">
          <SettingsItem
            icon={<Download size={22} color={colors.secondary} />}
            title="Download Quality"
            value="Medium"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Wifi size={22} color={colors.primary} />}
            title="Download on Wi-Fi Only"
            isSwitch
            switchValue={wifiOnly}
            onSwitchChange={(value) => setWifiOnly(value)}
          />
        </SettingsSection>
        
        <SettingsSection title="NOTIFICATIONS">
          <SettingsItem
            icon={<Bell size={22} color={colors.accent} />}
            title="Push Notifications"
            isSwitch
            switchValue={notifications}
            onSwitchChange={(value) => setNotifications(value)}
          />
        </SettingsSection>
        
        <SettingsSection title="ABOUT">
          <SettingsItem
            icon={<Info size={22} color={colors.primary} />}
            title="About MangaLo"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<HelpCircle size={22} color={colors.secondary} />}
            title="Help & Support"
            onPress={() => {}}
          />
        </SettingsSection>
        
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={() => {}}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.secondaryText }]}>
          Version 1.0.0
        </Text>
        
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});