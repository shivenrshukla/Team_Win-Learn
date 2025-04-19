import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './SearchBar'; // Adjust the path accordingly

interface MangaSearchResult {
  id: string;
  title: string;
  cover: string;
  author: string;
  genre: string[];
  status: string;
}

const MOCK_RESULTS: MangaSearchResult[] = [/* same mock data as before */];

export default function SearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<MangaSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const filteredResults = MOCK_RESULTS.filter(manga =>
        manga.title.toLowerCase().includes(query.toLowerCase()) ||
        manga.author.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query.toLowerCase())) {
      setRecentSearches(prev => [query.toLowerCase(), ...prev.slice(0, 4)]);
    }
  };

  const handleMangaPress = (id: string) => {
    router.push(`/manga/${id}`);
  };

  const renderMangaItem = ({ item }: { item: MangaSearchResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleMangaPress(item.id)}>
      <Image source={{ uri: item.cover }} style={styles.mangaCover} />
      <View style={styles.mangaInfo}>
        <Text style={styles.mangaTitle}>{item.title}</Text>
        <Text style={styles.mangaAuthor}>By {item.author}</Text>
        <View style={styles.genreRow}>
          {item.genre.slice(0, 2).map((g, i) => (
            <View key={i} style={styles.genreTag}>
              <Text style={styles.genreText}>{g}</Text>
            </View>
          ))}
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4A6CF7" style={styles.loader} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderMangaItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color="#DDD" />
          <Text style={styles.noResultsText}>
            {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  searchHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backButton: {
    marginRight: 12,
  },
  searchBarWrapper: {
    flex: 1,
  },
  loader: {
    marginTop: 32,
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mangaCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#DDD',
  },
  mangaInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  mangaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mangaAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  genreRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  genreTag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#4A6CF7',
  },
  statusTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
