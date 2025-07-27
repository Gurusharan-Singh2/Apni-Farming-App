import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';

const BannerCarousel = ({ banners, isLoading, isError }) => {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [banners, width]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

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
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        style={{ width: '100%' }}
      >
        {banners.map((item, index) => (
          <View
            key={index}
            style={{ width }}
            className="items-center justify-center"
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/bannerView',
                  params: {
                    linkType: item.link_type,
                    link: item.link,
                    categoryId: item.category_id,
                    productId: item.product_id,
                  },
                })
              }
            >
              <Image
                source={{ uri: item.image_path }}
                className="h-52 rounded-2xl"
                style={{ width:width-15 }}
                resizeMode="cover" 
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BannerCarousel;
