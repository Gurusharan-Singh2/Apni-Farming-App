import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {  BackendUrl2 } from '../utils/Constants';
import { useRouter } from "expo-router";


const fetchCategories = async () => {
  // const { data } = await axios.get(`${BackendUrl}/api/categories`);
  const { data } = await axios.get(`${BackendUrl2}/user/categories/getAllCategories.php`);
  return [{ id: '0', name: 'All', image: 'https://jobdsco.s3.ap-south-1.amazonaws.com/public/s550_4xb7_231012.jpg' }, ...data]; 
};

const CategoryItem = () => {
  

  const router=useRouter()

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleCategoryPress = (categoryId) => {
  
   router.push(`/product_screen/${categoryId}`);
   
  };

  return (
    <View className="mt-4">
      <Text className="text-heading-big font-bold px-5 py-3">Shop By Category</Text>

      {isLoading && <Text className="px-5">Loading categories...</Text>}
      {error && <Text className="px-5 text-red-500">Failed to load categories</Text>}

      {!isLoading && !error && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft:6
          }}
          
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.id)}
                className={`items-center mx-1 pb-0    w-[90px] min-h-[112px] `}
              >
                <Image
                  source={{ uri: item.image }}
                  className={`w-full h-24  rounded-lg   `}
                  resizeMode="cover"
                />
                <Text className={`text-center font-bold text-[11px] mt-1 mb-0`}>
                  { item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default CategoryItem;
