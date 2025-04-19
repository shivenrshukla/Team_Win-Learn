import React from 'react';
import { FlatList, StyleSheet, View, useColorScheme } from 'react-native';
import MangaCard from './MangaCard';
import { MangaItem } from '@/utils/types';
import Colors from '@/constants/Colors';

type MangaGridProps = {
  data: MangaItem[];
  columns?: number;
  cardSize?: 'small' | 'medium' | 'large';
  showHorizontal?: boolean;
};

const MangaGrid: React.FC<MangaGridProps> = ({
  data,
  columns = 2,
  cardSize = 'medium',
  showHorizontal = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  if (showHorizontal) {
    return (
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.horizontalContainer}
        renderItem={({ item }) => (
          <View style={styles.horizontalItem}>
            <MangaCard manga={item} size={cardSize} />
          </View>
        )}
      />
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={columns}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
      renderItem={({ item }) => <MangaCard manga={item} size={cardSize} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  horizontalItem: {
    marginRight: 12,
  },
});

export default MangaGrid;