// SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '../app/Color'; // Make sure it's importing correctly

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text); // Pass the query to the parent component
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder="Search manga..."
        placeholderTextColor={Colors.light.gray} // Now using the gray color
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default SearchBar;
