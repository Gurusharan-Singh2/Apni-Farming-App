import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/Colors';
import Back from '../../components/Back';
import CartIconWithBadge from '../../components/Carticon';
import ProfileIcon from '../../components/ProfileIcon';
import YouMayAlsoLike from '../../components/YouMayAlsoLike';
import useAuthStore from '../../Store/AuthStore';
import { BackendUrl2 } from '../../utils/Constants';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 4;
const NUM_COLUMNS = 3;
const cardWidth =
  (screenWidth - CARD_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS;
const imageSize = cardWidth * 0.85; 

const fetchCategories = async () => {
  const { data } = await axios.get(
    `${BackendUrl2}/user/categories/getAllCategories.php`
  );
  return data;
};

const CategoriesScreen = ({ setCategoryId }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categoriesPage'],
    queryFn: fetchCategories,
  });

  const handleCategoryPress = (id) => {
    setSelectedCategory(id);
    setCategoryId?.(id);
    router.push(`/product_screen/${id}`);
  };

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedCategory === item.id;
      return (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.id)}
          style={{
            width: cardWidth,
            margin: CARD_MARGIN,
            paddingVertical: 8,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: isSelected ? '#fef9c3' : '#fff',
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected ? '#facc15' : 'transparent',
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: 12,
              marginBottom: 8,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: Math.round(screenWidth * 0.032), // ~12px on small screens, scales up
              fontWeight: '600',
              textAlign: 'center',
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategory]
  );

  if (isLoading)
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  if (error)
    return (
      <Text className="text-red-500 text-center mt-4">
        Failed to load categories.
      </Text>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
          <Back title="Categories" />
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{
          justifyContent: 'space-around',
          marginHorizontal: 4,
        }}
        ListFooterComponent={() => (
          <YouMayAlsoLike
            url={`${BackendUrl2}/user/products/youamyalsolike.php`}
            title="You May Also Like"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default React.memo(CategoriesScreen);
