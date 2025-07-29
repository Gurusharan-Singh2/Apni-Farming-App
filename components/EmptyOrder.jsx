// components/EmptyCart.js
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

const EmptyOrder = () => {
  return (
    <View className="flex-1 mt-6 items-center justify-center  bg-white px-6">
      <LottieView 
        source={require('../assets/animations/embty_cart.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200,marginBottom:10}}
      />

      <Text className="text-[16px] font-bold text-[#D02127] mt-4">
    Swipe, tap, and let the cart party begin!
      </Text>

      <Text className="text-sm text-black font-semibold text-center mt-2 mb-2">
        Begin your shopping journey by adding items to your cart
      </Text>

      
    </View>
  );
};

export default EmptyOrder;
