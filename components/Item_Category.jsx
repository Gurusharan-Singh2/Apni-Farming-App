import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BackendUrl } from '../utils/Constants';

const fetchCategories = async () => {
  const { data } = await axios.get(`${BackendUrl}/api/categories`);
  return [{ id: '0', name: 'All', image: 'https://img.icons8.com/ios-filled/50/shop.png' }, ...data]; 
};

const CategoryItem = ({ setCategoryId }) => {
  const [selectedCategory, setSelectedCategory] = useState('0');

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
   setCategoryId(categoryId)
  };

  return (
    <View className="mt-4">
      <Text className="text-sm font-semibold px-5 py-3">Shop By Category</Text>

      {isLoading && <Text className="px-5">Loading categories...</Text>}
      {error && <Text className="px-5 text-red-500">Failed to load categories</Text>}

      {!isLoading && !error && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8,  }}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedCategory;
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.id)}
                className={`items-center mx-2 border border-gray-200 p-2 rounded-xl w-20 ${isSelected ? 'bg-green-100 rounded-xl' : ''}`}
              >
                <Image
                  source={{ uri: item.image }}
                  className={`w-16 h-16 rounded-full ${isSelected ? 'border-2 border-green-600' : ''} bg-gray-100`}
                  resizeMode="cover"
                />
                <Text className={`text-center text-xs mt-1 ${isSelected ? 'text-green-600 font-semibold' : ''}`}>
                  {item.name?.length > 12 ? item.name.slice(0, 11) + '…' : item.name}
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
