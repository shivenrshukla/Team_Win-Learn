import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search manga, authors...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Search
        size={18}
        color={colors.secondaryText}
        style={styles.searchIcon}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: 'Inter-Regular',
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={handleClearSearch}
          style={styles.clearButton}
        >
          <X size={18} color={colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;