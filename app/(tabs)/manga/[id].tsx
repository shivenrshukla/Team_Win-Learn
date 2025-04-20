import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Star, Clock, Heart, Share2, Download, Link, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from '@/components/HeaderBar';
import MangaGrid from '@/components/MangaGrid';
import Colors from '@/constants/Colors';
import { mockMangaData } from '@/utils/mockData';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function MangaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const scrollY = new Animated.Value(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the manga by id
  const manga = mockMangaData.find(m => m.id.toString() === id) || mockMangaData[0];
  const similarManga = mockMangaData.slice(0, 6);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const coverOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const startReading = () => {
    router.push(`/manga/read/${manga.id}/1`);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const { width } = Dimensions.get('window');
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.headerBackground, { backgroundColor: colors.background, opacity: headerOpacity, borderBottomColor: colors.border }]}>
        <HeaderBar title={manga.title} showBack={true} transparent />
      </Animated.View>
      
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.coverContainer}>
          <Animated.Image
            source={{ uri: manga.coverImage }}
            style={[styles.coverImage, { opacity: coverOpacity, width }]}
            resizeMode="cover"
          />
          <AnimatedLinearGradient
            colors={['transparent', colors.background]}
            style={[styles.coverGradient, { width }]}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>{manga.title}</Text>
            <Text style={[styles.author, { color: colors.secondaryText }]}>{manga.author}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={[styles.statText, { color: colors.secondaryText }]}>
                  {manga.rating} ({manga.ratingCount || '1.2k'})
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <BookOpen size={16} color={colors.secondaryText} />
                <Text style={[styles.statText, { color: colors.secondaryText }]}>
                  {manga.chapters || '243'} Ch
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Clock size={16} color={colors.secondaryText} />
                <Text style={[styles.statText, { color: colors.secondaryText }]}>
                  {manga.status || 'Ongoing'}
                </Text>
              </View>
            </View>
            
            <View style={styles.genreContainer}>
              {(manga.genres || ['Action', 'Adventure', 'Fantasy']).map((genre, index) => (
                <View
                  key={index}
                  style={[
                    styles.genreTag,
                    { backgroundColor: colors.secondaryBackground, borderColor: colors.border }
                  ]}
                >
                  <Text style={[styles.genreText, { color: colors.secondaryText }]}>
                    {genre}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={startReading}
            >
              <BookOpen size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Start Reading</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}
                onPress={toggleFavorite}
              >
                <Heart 
                  size={20} 
                  color={isFavorite ? colors.accent : colors.secondaryText} 
                  fill={isFavorite ? colors.accent : 'none'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}
              >
                <Download size={20} color={colors.secondaryText} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.secondaryBackground, borderColor: colors.border }]}
              >
                <Share2 size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.synopsisContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Synopsis
            </Text>
            <Text style={[styles.synopsis, { color: colors.secondaryText }]}>
              {manga.description || "A highschool student, who dislikes troublesome situations, finds himself in a different world, where he must protect girls with the rare race of dragons. In this world dragons are the Takers of lives but they bestow their powers to a certain race of girls to win wars and battles."}
            </Text>
          </View>
          
          <View style={styles.chaptersContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Chapters
            </Text>
            
            {[1, 2, 3].map((chapter) => (
              <TouchableOpacity
                key={chapter}
                style={[styles.chapterItem, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/manga/read/${manga.id}/${chapter}`)}
              >
                <View>
                  <Text style={[styles.chapterTitle, { color: colors.text }]}>
                    Chapter {chapter}
                  </Text>
                  <Text style={[styles.chapterDate, { color: colors.secondaryText }]}>{new Date(Date.now() - chapter * 86400000).toLocaleDateString()}</Text>
                </View>
                <ExternalLink size={18} color={colors.secondaryText} />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.moreChaptersButton, { borderColor: colors.border }]}
            >
              <Text style={[styles.moreChaptersText, { color: colors.primary }]}>
                View All Chapters
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.similarContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Similar Manga
            </Text>
            <MangaGrid data={similarManga} columns={2} cardSize="medium" />
          </View>
          
          <View style={{ height: insets.bottom + 20 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomWidth: 1,
  },
  coverContainer: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    height: 300,
    position: 'absolute',
  },
  coverGradient: {
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  scrollContentContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  author: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  genreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  actionContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  synopsisContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  synopsis: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  chaptersContainer: {
    marginBottom: 24,
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chapterTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 2,
  },
  chapterDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  moreChaptersButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  moreChaptersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  similarContainer: {
    marginBottom: 24,
  },
});
