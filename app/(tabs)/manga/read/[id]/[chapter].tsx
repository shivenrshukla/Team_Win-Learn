import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Settings, ChevronDown, Menu } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { mockMangaData, mockChapterImages } from '@/utils/mockData';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ReadingMode = 'vertical' | 'rtl' | 'ltr';

export default function ReadChapterScreen() {
  const { id, chapter } = useLocalSearchParams<{ id: string; chapter: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  
  const [controlsVisible, setControlsVisible] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>('vertical');
  const [currentPage, setCurrentPage] = useState(0);
  
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);
  
  const manga = mockMangaData.find(m => m.id.toString() === id) || mockMangaData[0];
  const images = mockChapterImages;
  const chapterNumber = parseInt(chapter as string, 10);
  
  useEffect(() => {
    if (controlsVisible) {
      showControls();
    } else {
      hideControls();
    }
  }, [controlsVisible]);
  
  const showControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };
  
  const handlePageChange = (index: number) => {
    setCurrentPage(index);
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({ index: currentPage - 1, animated: true });
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < images.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    } else {
      // Go to next chapter or show chapter completed modal
    }
  };
  
  const renderVerticalMode = () => {
    return (
      <FlatList
        data={images}
        keyExtractor={(_, index) => `page-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleControls}
            style={[styles.pageContainer, { width, backgroundColor: colors.background }]}
          >
            <Image
              source={{ uri: item }}
              style={[styles.verticalImage, { width }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    );
  };
  
  const renderHorizontalMode = () => {
    return (
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => `page-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleControls}
            style={[styles.pageContainer, { width, height: height - insets.top - insets.bottom }]}
          >
            <Image
              source={{ uri: item }}
              style={styles.horizontalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        onMomentumScrollEnd={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const index = Math.floor(offsetX / width);
          handlePageChange(index);
        }}
      />
    );
  };
  
  const renderReadingControls = () => {
    if (readingMode === 'vertical') {
      return null;
    }
    
    return (
      <View style={styles.pageControls}>
        <TouchableOpacity
          style={[styles.pageControlButton, { opacity: currentPage > 0 ? 1 : 0.5 }]}
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          {readingMode === 'rtl' ? (
            <ArrowRight size={24} color="#FFFFFF" />
          ) : (
            <ArrowLeft size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.pageControlButton,
            { opacity: currentPage < images.length - 1 ? 1 : 0.5 },
          ]}
          onPress={goToNextPage}
          disabled={currentPage === images.length - 1}
        >
          {readingMode === 'rtl' ? (
            <ArrowLeft size={24} color="#FFFFFF" />
          ) : (
            <ArrowRight size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderModeSelector = () => {
    return (
      <View style={[
        styles.modeSelector,
        { 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          paddingBottom: insets.bottom || 16
        }
      ]}>
        <View style={styles.modeSelectorHeader}>
          <View style={styles.modeSelectorHandle} />
        </View>
        
        <Text style={[styles.modeSelectorTitle, { color: colors.text }]}>
          Reading Mode
        </Text>
        
        <View style={styles.modeSelectorOptions}>
          <TouchableOpacity
            style={[
              styles.modeOption,
              readingMode === 'vertical' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary 
              },
            ]}
            onPress={() => setReadingMode('vertical')}
          >
            <Text
              style={[
                styles.modeOptionText,
                { color: readingMode === 'vertical' ? colors.primary : colors.secondaryText },
              ]}
            >
              Vertical Scroll
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeOption,
              readingMode === 'rtl' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary 
              },
            ]}
            onPress={() => setReadingMode('rtl')}
          >
            <Text
              style={[
                styles.modeOptionText,
                { color: readingMode === 'rtl' ? colors.primary : colors.secondaryText },
              ]}
            >
              Right to Left
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeOption,
              readingMode === 'ltr' && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary 
              },
            ]}
            onPress={() => setReadingMode('ltr')}
          >
            <Text
              style={[
                styles.modeOptionText,
                { color: readingMode === 'ltr' ? colors.primary : colors.secondaryText },
              ]}
            >
              Left to Right
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.background + 'CC',
            paddingTop: insets.top || 44,
            opacity: controlsOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronDown size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.mangaTitle, { color: colors.text }]} numberOfLines={1}>
            {manga.title}
          </Text>
          <Text style={[styles.chapterInfo, { color: colors.secondaryText }]}>
            Chapter {chapterNumber}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.settingsButton}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>
      
      {readingMode === 'vertical' ? renderVerticalMode() : renderHorizontalMode()}
      
      {renderReadingControls()}
      
      <Animated.View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background + 'CC',
            paddingBottom: insets.bottom || 16,
            opacity: controlsOpacity,
          },
        ]}
      >
        <Text style={[styles.pageIndicator, { color: colors.text }]}>
          {currentPage + 1} / {images.length}
        </Text>
        
        <View style={styles.chapterControls}>
          <TouchableOpacity
            style={[
              styles.chapterButton,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
              chapterNumber === 1 && { opacity: 0.5 },
            ]}
            disabled={chapterNumber === 1}
            onPress={() => router.push(`/manga/read/${id}/${chapterNumber - 1}`)}
          >
            <Text style={[styles.chapterButtonText, { color: colors.text }]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingsButton,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
            ]}
            onPress={() => {}}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.chapterButton,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
            ]}
            onPress={() => router.push(`/manga/read/${id}/${chapterNumber + 1}`)}
          >
            <Text style={[styles.chapterButtonText, { color: colors.text }]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  mangaTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  chapterInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalImage: {
    height: undefined,
    aspectRatio: 0.7,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
  },
  pageIndicator: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  chapterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    width: '40%',
    alignItems: 'center',
  },
  chapterButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  pageControls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 5,
  },
  pageControlButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSelector: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modeSelectorHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modeSelectorHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CCCCCC',
  },
  modeSelectorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  modeSelectorOptions: {
    gap: 12,
  },
  modeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  modeOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});