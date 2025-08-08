// components/EmptyCategory.js
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const EmptyCategory = () => {
  const router = useRouter();

  return (
    <View className="flex-1 mt-6 items-center justify-center bg-white px-6">
      <LottieView
        source={require('../assets/animations/Settings.json')} // You need to add an appropriate animation JSON here
        autoPlay
        loop
        style={{ width: 180, height: 180, marginBottom: 10 }}
      />

      <Text className="text-[16px] font-bold text-[#D02127] mt-4">
        Oops! Nothing here yet 📦
      </Text>

      <Text className="text-sm text-black font-semibold text-center mt-2 mb-2">
        No products found in this category. Try browsing other sections.
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/home')}
        className="bg-blue-500 py-2 px-10 rounded-full border-2 font-semibold border-blue-500"
      >
        <Text className="text-white text-[18px] font-bold">
          Explore More
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyCategory;
