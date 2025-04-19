import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';
import MangaGrid from '@/components/MangaGrid';
import Colors from '@/constants/Colors';
import { mockMangaData } from '@/utils/mockData';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // For demo, we'll use a subset of mock data
  const favoriteManga = mockMangaData.slice(0, 6);
  const hasFavorites = favoriteManga.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Favorites" showSearch={true} />
      
      {hasFavorites ? (
        <MangaGrid
          data={favoriteManga}
          columns={2}
          cardSize="medium"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
            Heart manga to add them to your favorites
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