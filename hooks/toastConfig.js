import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View className="flex-row items-center flex-2 bg-green-100 border-l-4 border-green-500 px-4 py-3 rounded-full shadow-lg mx-4 mt-2">
      <Ionicons name="checkmark-circle" size={24} color="#059669" className="mr-3" />
      <View className="flex-1">
        <Text className="text-green-900 font-semibold text-sm">{text1}</Text>
        {text2 ? <Text className="text-green-800 text-xs">{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View className="flex-row items-center w-[90%] bg-red-100 border-l-4 border-red-500 px-4 py-3 rounded-2xl shadow-lg mx-auto mt-2">
      <Ionicons name="close-circle" size={24} color="#dc2626" className="mr-3" />
      <View className="flex-1">
        <Text className="text-red-900 font-semibold text-base">{text1}</Text>
        {text2 ? <Text className="text-red-800 text-sm">{text2}</Text> : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View className="flex-row items-center w-[90%] bg-blue-100 border-l-4 border-blue-500 px-4 py-3 rounded-2xl shadow-lg mx-auto mt-2">
      <Ionicons name="information-circle" size={24} color="#3b82f6" className="mr-3" />
      <View className="flex-1">
        <Text className="text-blue-900 font-semibold text-base">{text1}</Text>
        {text2 ? <Text className="text-blue-800 text-sm">{text2}</Text> : null}
      </View>
    </View>
  ),
};
