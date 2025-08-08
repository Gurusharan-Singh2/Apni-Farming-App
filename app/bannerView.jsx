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
  const { linkType, link, categoryId, productId } = useLocalSearchParams();
const {isAuthenticated}=useAuthStore();
  // Fetch products by category
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ['products', categoryId],
    enabled: linkType === 'category' && !!categoryId,
    queryFn: async () => {
      const res = await axios.get(
        `${BackendUrl2}/user/categories/getProductsByCategory.php?id=${categoryId}`
      );
      return res.data;
    },
  });
const fetchProductById = async (id) => {
  const res = await axios.post(`${BackendUrl2}/user/products/getProductbyid.php`, {
    productId: Number(id),
  });

  

  // Extract the actual product object
  return res.data?.data ?? null;
};

// Fetch single product
const {
  data: product,
  isLoading: productLoading,
  isError: productError,
} = useQuery({
  queryKey: ['product', productId],
  enabled: linkType === 'product' && !!productId,
  queryFn: () => fetchProductById(productId), 
});


  const handleOpenLink = useCallback(() => {
    if (link) Linking.openURL(link);
  }, [link]);

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

  const singleProduct = useMemo(() => {
    if (productLoading)
      return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
    if (productError || !product)
      return <Text className="text-red-500">Product not found</Text>;

    return (
      <View style={{ paddingHorizontal: 12 }}>
        <Pp product={product}/>
      </View>
    );
  }, [productLoading, productError, product]);

  const externalLink = useMemo(() => {
    return (
      <TouchableOpacity onPress={handleOpenLink}>
        <Text className="text-blue-500 underline">
          Open external link: {link}
        </Text>
      </TouchableOpacity>
    );
  }, [handleOpenLink, link]);

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
        {linkType === 'category' && categoryProducts}
        {linkType === 'product' && singleProduct}
        {linkType === 'general' && link && externalLink}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(BannerView);
