import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderBar from '@/components/HeaderBar';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import CategoryPills from '@/components/CategoryPills';
import MangaGrid from '@/components/MangaGrid';
import Colors from '@/constants/Colors';
import { mockMangaData, categories } from '@/utils/mockData';

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Filter manga by category
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Get appropriate manga lists
  const featuredManga = mockMangaData.slice(0, 5);
  const popularManga = mockMangaData.slice(5, 11);
  const newReleases = mockMangaData.slice(12, 18);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="MangaLo" 
        showSearch={true} 
        showNotification={true} 
        onSearchPress={() => {}} 
      />
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <SearchBar onSearch={handleSearch} />
        
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        
        <SectionHeader
          title="Featured"
          onSeeAll={() => {
            // Navigate to see all featured
          }}
        />
        <MangaGrid
          data={featuredManga}
          columns={1}
          cardSize="large"
        />
        
        <SectionHeader
          title="Popular Now"
          onSeeAll={() => {
            // Navigate to see all popular
          }}
        />
        <MangaGrid
          data={popularManga}
          showHorizontal={true}
          cardSize="medium"
        />
        
        <SectionHeader
          title="New Releases"
          onSeeAll={() => {
            // Navigate to see all new releases
          }}
        />
        <MangaGrid
          data={newReleases}
          columns={2}
          cardSize="medium"
        />
        
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});