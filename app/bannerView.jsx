import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Colors } from '../assets/Colors';
import Pp from '../components/BannerViewSingleProduct';
import BannerProductCard from '../components/BannerProductCard';
import axios from 'axios';
import { BackendUrl2 } from '../utils/Constants';
import Back from '../components/Back';
import CartIconWithBadge from '../components/Carticon';
import ProfileIcon from '../components/ProfileIcon';
import useAuthStore from '../Store/AuthStore';

const BannerView = () => {
  const { id } = useLocalSearchParams();
const {isAuthenticated}=useAuthStore();
  // Fetch products by category
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ['products', id],
   
    queryFn: async () => {
      const res = await axios.get(
        `${BackendUrl2}/user/products/getofferproduct.php?banner_id=${id}`
      );
      
      
      return res.data.data;
    },
  });


  

  const renderCategoryItem = useCallback(
    ({ item }) => <BannerProductCard item={item} />,
    []
  );

  const categoryProducts = useMemo(() => {
    if (productsLoading)
      return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
    if (productsError || !products?.length)
      return <Text className="text-red-500">No products found</Text>;

    return (
      <FlatList
        key={'category-grid'}
        data={products}
        numColumns={2}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 12,
        }}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    );
  }, [productsLoading, productsError, products, renderCategoryItem]);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY , paddingHorizontal:6, paddingTop:4}}>
      <View className="flex flex-row w-full justify-between px-6 my-3">
       <Back title="Explore" />
        <View className="flex flex-row items-center gap-2">
        <CartIconWithBadge/>
{isAuthenticated() && <ProfileIcon />}
        </View>
        </View>
      <View style={{ flex: 1, paddingTop: 8 }}>
        { categoryProducts}
        
      </View>
    </SafeAreaView>
  );
};

export default React.memo(BannerView);
