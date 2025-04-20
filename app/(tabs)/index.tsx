import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import HeaderBar from '@/components/HeaderBar';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import SectionHeader from '@/components/SectionHeader';
import MangaGrid from '@/components/MangaGrid';
import Colors from '@/constants/Colors';
import { mockMangaData, categories } from '@/utils/mockData';
import { Image } from 'react-native';
import logo from '../../assets/images/logo.png';

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredManga, setFilteredManga] = useState(mockMangaData);

  // Update filtered manga when category or search query changes
  useEffect(() => {
    let filtered = mockMangaData;

    console.log("Selected Category:", selectedCategory); // Debugging line
    console.log("Filtered Manga (before category filtering):", filtered); // Debugging line

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((manga) => {
        return manga.genres?.some((genre) =>
          genre.toLowerCase() === selectedCategory.toLowerCase()
        );
      });
    }    

    console.log("Filtered Manga (after category filtering):", filtered); // Debugging line

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((manga) =>
        manga.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredManga(filtered);
  }, [selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar
  logo={
    <Image
      source={logo}
      style={{
        width: 150,          // Increase size
        height: 90,          // Adjust proportionally
        resizeMode: 'contain',
        marginLeft: -50,     // Move slightly to the left
      }}
    />
  }
  showSearch={true}
  showNotification={true}
/>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar onSearch={handleSearch} />

        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <SectionHeader title="Featured" />
        <MangaGrid data={filteredManga} columns={1} cardSize="large" />

        <SectionHeader title="Popular Now" />
        <MangaGrid data={filteredManga} showHorizontal={true} cardSize="medium" />

        <SectionHeader title="New Releases" />
        <MangaGrid data={filteredManga} columns={2} cardSize="medium" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
