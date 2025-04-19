import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookmarkPlus, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MangaItem } from '@/utils/types';

type MangaCardProps = {
  manga: MangaItem;
  size?: 'small' | 'medium' | 'large';
};

const MangaCard: React.FC<MangaCardProps> = ({ manga, size = 'medium' }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();
  const { width } = Dimensions.get('window');
  
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  
  // Card sizing based on screen width and requested size
  const cardWidth = isSmall ? width / 3 - 16 : isLarge ? width - 32 : width / 2 - 24;
  const imageHeight = isSmall ? 150 : isLarge ? 220 : 180;

  const navigateToDetail = () => {
    router.push(`/manga/${manga.id}`);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          width: cardWidth,
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }
      ]} 
      onPress={navigateToDetail}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: manga.coverImage }} 
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={[styles.bookmarkButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <BookmarkPlus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {manga.rating && (
          <View style={[styles.ratingContainer, { backgroundColor: colors.accent }]}>
            <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.ratingText}>{manga.rating}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text 
          style={[
            styles.title, 
            { color: colors.text },
            isSmall && styles.smallTitle
          ]} 
          numberOfLines={2}
        >
          {manga.title}
        </Text>
        
        {!isSmall && (
          <>
            <Text style={[styles.author, { color: colors.secondaryText }]} numberOfLines={1}>
              {manga.author}
            </Text>
            
            {!isSmall && manga.latestChapter && (
              <View style={styles.chapterContainer}>
                <Text style={[styles.chapter, { color: colors.secondaryText }]}>
                  Ch. {manga.latestChapter}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  bookmarkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginLeft: 2,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 12,
  },
  author: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  chapterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapter: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});

export default MangaCard;