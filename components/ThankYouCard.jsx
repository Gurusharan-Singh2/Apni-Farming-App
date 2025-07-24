// components/ThankYouCard.js
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

const ThankYouCard = ({ orderId, onOrderMore }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <LottieView
        source={require('../assets/animations/Thank.json')}
        autoPlay
        loop={true}
        style={{ width: 400, height: 400 }}
      />

      <Text className="text-3xl font-bold text-green-700 mt-[-20]">Thank You!</Text>
      <Text className="text-base text-gray-700 text-center mt-2">Your order was placed successfully 🎉</Text>
      <Text className="text-sm text-gray-500 mt-1 mb-6">Order ID: {orderId}</Text>

      <TouchableOpacity
        onPress={onOrderMore}
        className="bg-green-700 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-base font-medium">Order More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThankYouCard;
