import React, { useState } from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../app/Color'; // Make sure it's importing correctly

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const colorScheme = useColorScheme(); // Detect current theme (light or dark)

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
        placeholderTextColor={colorScheme === 'dark' ? Colors.dark.gray : Colors.light.gray} // Adjust placeholder color based on theme
        style={[styles.input, { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }]} // Adjust text color based on theme
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
  },
});

export default SearchBar;

