import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const OrderScreen = () => {
  // const navigation = useNavigation();
  const router=useRouter();

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        
      </View>
    


      {/* Content */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-500">This is your order page</Text>
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;
