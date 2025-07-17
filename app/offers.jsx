import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OfferScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">🎁 Offers</Text>
        {orderId ? (
          <Text className="mt-2 text-base">Order ID: {orderId}</Text>
        ) : (
          <Text className="mt-2 text-base text-gray-500">No order ID received</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OfferScreen;
