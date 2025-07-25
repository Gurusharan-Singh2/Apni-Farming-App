import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../assets/Colors';
import ProductCard from '../components/ProductCard';
import BannerProductCard from '../components/BannerProductCard';
import React from 'react';
import axios from 'axios';
import { BackendUrl2 } from '../utils/Constants';

const BannerView = () => {
  const router = useRouter();
  const { linkType, link, categoryId, productId } = useLocalSearchParams();

  // === Fetch All Products by Category ===
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ['products', categoryId],
    enabled: linkType === 'category' && !!categoryId,
    queryFn: async () => {
      const url = `${BackendUrl2}/user/categories/getProductsByCategory.php?id=${categoryId}`;
      const res = await axios.get(url);
      return res.data;
    },
  });

  // === Fetch Single Product ===
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ['product', productId],
    enabled: linkType === 'product' && !!productId,
    queryFn: async () => {
      const res = await fetch(`${BackendUrl2}/user/products/getProductById.php?id=${productId}`);
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
  });

 const renderCategoryProducts = () => {
  if (productsLoading) return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  if (productsError || !products?.length) return <Text className="text-red-500">No products found</Text>;

  return (
    <FlatList
      key={'category-grid'} // ✅ force remount for proper numColumns
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <BannerProductCard item={item} />}
      contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
      columnWrapperStyle={{ justifyContent: 'space-between', gap: 10, marginBottom: 12 }}
    />
  );
};


  const renderSingleProduct = () => {
    if (productLoading) return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
    if (productError || !product) return <Text className="text-red-500">Product not found</Text>;

    return (
      <View style={{ paddingHorizontal: 12 }}>
        <ProductCard product={product} />
      </View>
    );
  };

  const renderExternalLink = () => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <Text className="text-blue-500 underline">Open external link: {link}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
      >
        <Ionicons name="arrow-back" size={26} color="black" />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, paddingTop: 8 }}>
        {linkType === 'category' && renderCategoryProducts()}
        {linkType === 'product' && renderSingleProduct()}
        {linkType === 'general' && link && renderExternalLink()}
      </View>
    </SafeAreaView>
  );
};

export default BannerView;
