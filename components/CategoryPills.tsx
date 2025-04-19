import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Colors from '@/constants/Colors';

type Category = {
  id: string;
  name: string;
};

type CategoryPillsProps = {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
};

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const handleSelectCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors.secondaryBackground,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={() => handleSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.secondaryText,
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
});

export default CategoryPills;