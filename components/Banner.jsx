import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Image, useWindowDimensions, ActivityIndicator, Text } from 'react-native';


const BannerCarousel = ({ banners = [], isLoading, isError }) => {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, width, banners]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center h-52">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || banners.length === 0) {
    return (
      <View className="items-center justify-center h-52">
        <Text className="text-red-500">Failed to load banners.</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
      >
        {banners.map((item, index) => (
          <View
            key={index}
            style={{ width }}
            className="items-center justify-center"
          >
            <Image
              source={{ uri: item.image_path }}
              className="h-52 rounded-2xl"
              style={{ width: width - 32 }}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      {/* <View className="absolute bottom-3 left-0 right-0 flex-row justify-center space-x-2">
        {banners.map((_, index) => (
          <View
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? 'bg-black' : 'bg-gray-400'
            }`}
          />
        ))}
      </View> */}
    </View>
  );
};

export default BannerCarousel;
