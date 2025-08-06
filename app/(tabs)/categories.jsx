import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { BackendUrl2 } from '../../utils/Constants';
import CartIconWithBadge from '../../components/Carticon';
import ProfileIcon from '../../components/ProfileIcon';
import useAuthStore from '../../Store/AuthStore';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import YouMayAlsoLike from '../../components/YouMayAlsoLike';
import Back from '../../components/Back';


const fetchCategories = async () => {




  const { data } = await axios.get(`${BackendUrl2}/user/categories/getAllCategories.php`);
  return data
};

const CategoriesScreen = ({ setCategoryId }) => {
  const {isAuthenticated}=useAuthStore();
const router=useRouter();
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

  const renderItem = ({ item }) => {
  const isSelected = selectedCategory === item.id;
  return (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item.id)}
      className={`w-[31%] m-1 p-3 rounded-2xl items-center ${
        isSelected ? 'bg-yellow-100 border border-yellow-400' : 'bg-white'
      }`}
    >
      <Image
        source={{ uri: item.image }}
        className="w-32 h-32 rounded-xl mb-2"
        resizeMode="cover"
      />
      <Text className="text-sm font-semibold text-center" numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};


  if (isLoading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text className="text-red-500 text-center mt-4">Failed to load categories.</Text>;

  return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
          
      <View className="mb-1"> 
      <View className="flex flex-row w-full justify-between px-6 my-3">
       <Back title="Categories" />
        <View className="flex flex-row items-center gap-2">
        <CartIconWithBadge/>
{isAuthenticated() && <ProfileIcon />}
        </View>
        </View>
        </View>

    
   <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListFooterComponent={()=>(
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

export default CategoriesScreen;
