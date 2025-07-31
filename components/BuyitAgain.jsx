import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';

import useAuthStore from '../Store/AuthStore';
import SuggestionCard from './SuggestionCard';


const BuyitAgain = ({url,title}) => {
  const { user } = useAuthStore();
  const customer_id = user?.userId;






  const fetchBuyItAgain = async () => {
    const res = await axios.post(
      url,
      {
        uid: customer_id,
        
      }
    );
  
    

    
    
    return res?.data?.data ?? [];
  };

 
  

  const {
    data: products,
    isLoading,
  } = useQuery({
    queryKey: ['products', customer_id],
    queryFn: fetchBuyItAgain,
    onError: (error) => {
      console.error('Error fetching Buy it again:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load Buy it again',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    enabled: !!customer_id,
    staleTime: 1000 * 60 * 5,
    retry:2,
    retryDelay:5*1000
  });
  return (
    <View className="py-2 mt-4 z-40">
      <Text className="text-lg font-bold px-4 mb-4">{title}</Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center h-32">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={products}
        renderItem={({ item }) => <SuggestionCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}

    </View>
  );
};

export default BuyitAgain;
