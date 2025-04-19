import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, CircleCheck as CheckCircle } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';
import MangaGrid from '@/components/MangaGrid';
import Colors from '@/constants/Colors';
import { mockMangaData } from '@/utils/mockData';

type LibraryTab = 'current' | 'completed' | 'all';

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LibraryTab>('current');

  // Filter manga by library tab
  const filteredManga = activeTab === 'all' 
    ? mockMangaData 
    : mockMangaData.slice(0, activeTab === 'current' ? 8 : 4);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="My Library" 
        showSearch={true}
        showMenu={true}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'current' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('current')}
        >
          <Clock
            size={18}
            color={activeTab === 'current' ? colors.primary : colors.secondaryText}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'current' ? colors.primary : colors.secondaryText,
              },
            ]}
          >
            Reading
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <CheckCircle
            size={18}
            color={activeTab === 'completed' ? colors.primary : colors.secondaryText}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'completed' ? colors.primary : colors.secondaryText,
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('all')}
        >
          <BookOpen
            size={18}
            color={activeTab === 'all' ? colors.primary : colors.secondaryText}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'all' ? colors.primary : colors.secondaryText,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      </View>

      {filteredManga.length > 0 ? (
        <MangaGrid
          data={filteredManga}
          columns={2}
          cardSize="medium"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={64} color={colors.secondaryText} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your library is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
            Bookmark manga to add them to your library
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.exploreButtonText}>Explore Manga</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});