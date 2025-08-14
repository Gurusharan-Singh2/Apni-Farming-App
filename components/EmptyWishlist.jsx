// components/EmptyWishlist.js
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const EmptyWishlist = () => {
  const router = useRouter();

  return (
    <View className="flex-1  items-center justify-center bg-white px-6">
      <LottieView
        source={require('../assets/animations/Astronaut - Light Theme.json')} // You’ll need to add this animation
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />

      <Text className="text-[16px] font-bold text-[#D02127] mt-4">
        Your wishlist is waiting for love ❤️
      </Text>

      <Text className="text-sm text-black font-semibold text-center mt-2 mb-2">
        No items yet. Start adding your favorites!
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/home')}
        className="bg-pink-500 py-2 px-10 rounded-full border-2 font-semibold border-pink-500"
      >
        <Text className="text-white text-[18px] font-bold">
          Browse Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyWishlist;
