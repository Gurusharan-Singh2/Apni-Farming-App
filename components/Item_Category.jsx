import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BackendUrl, BackendUrl2 } from '../utils/Constants';

const fetchCategories = async () => {
  // const { data } = await axios.get(`${BackendUrl}/api/categories`);
  const { data } = await axios.get(`${BackendUrl2}/user/categories/getAllCategories.php`);
  return [{ id: '0', name: 'All', image: 'https://jobdsco.s3.ap-south-1.amazonaws.com/public/s550_4xb7_231012.jpg' }, ...data]; 
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
          
          renderItem={({ item }) => {
            const isSelected = item.id === selectedCategory;
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.id)}
                className={`items-center mx-1 pb-0    w-[90px] min-h-[112px] ${isSelected ? 'border rounded-lg border-green-500 ' : ''}`}
              >
                <Image
                  source={{ uri: item.image }}
                  className={`w-full h-24  rounded-lg   `}
                  resizeMode="cover"
                />
                <Text className={`text-center text-[10px] mt-1 mb-0 ${isSelected ? 'text-green-600 font-semibold' : ''}`}>
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
