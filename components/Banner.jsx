import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// ✅ Memoized banner item with styling preserved
const BannerItem = React.memo(({ item, width, onPress }) => (
  <View style={{ width }} className="items-center justify-center">
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: item.image_path }}
        className="h-52 rounded-2xl"
        style={{ width: width - 15 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  </View>
));

const BannerCarousel = ({ banners, isLoading, isError }) => {
  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();


  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const handleScroll = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, [width]);


  const renderItem = useCallback(
    ({ item }) => {
      const handlePress = () =>
        router.push({
          pathname: '/bannerView',
          params: {
            linkType: item.link_type,
            link: item.link,
            categoryId: item.category_id,
            productId: item.pid,
          },
        });

      return <BannerItem item={item} width={width} onPress={handlePress} />;
    },
    [router, width]
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center h-52 w-full">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !banners || banners.length === 0) {
    return (
      <View className="items-center justify-center h-52 w-full">
        <Text className="text-red-500">Failed to load banners.</Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={0}
        windowSize={3}
      />
    </View>
  );
};

export default React.memo(BannerCarousel);
