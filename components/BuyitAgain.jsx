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
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import useCartStore from '../Store/CartStore';
import useAuthStore from '../Store/AuthStore';
import useWishlistStore from '../Store/WishlistStore';
import { BackendUrl2 } from '../utils/Constants';

const BuyitAgain = ({url,title}) => {
  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedSize, setSelectedSize] = useState(null);


  const {
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistStore();

  const { addToCart, cart, increment, decrement } = useCartStore();

  const fetchBuyItAgain = async () => {
    const res = await axios.post(
      url,
      {
        uid: customer_id,
        cart
      }
    );
    console.log(res.data);
    
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

 

  const {
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ['wishlist', customer_id],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.apnifarming.com/user/wishlists/wishlist.php?action=list&customer_id=${customer_id}`
      );
      setWishlist(res.data.data || []);
      return res.data.data;
    },
    enabled: !!customer_id,
    staleTime: 1000 * 60 * 5,
    onError: () => clearWishlist(),
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () =>
      axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=add`, {
        customer_id,
        product_id: selectedProduct?.id,
      }),
    onSuccess: () => {
      addToWishlist(selectedProduct);
      refetchWishlist();
      Toast.show({ type: 'success', text1: 'Added to wishlist' });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: () =>
      axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=remove`, {
        customer_id,
        product_id: selectedProduct?.id,
      }),
    onSuccess: () => {
      removeFromWishlist(selectedProduct?.id);
      refetchWishlist();
      Toast.show({ type: 'success', text1: 'Removed from wishlist' });
    },
  });

  const toggleWishlist = async (product) => {
    setSelectedProduct(product);
    if (!isAuthenticated()) {
      Toast.show({
        type: 'error',
        text1: 'Please login to manage wishlist',
      });
      return;
    }
    
    

    const isInWishlist = wishlist.some((w) => w.product_id == product.id);
    if (isInWishlist) {
      await removeFromWishlistMutation.mutateAsync();
    } else {
      await addToWishlistMutation.mutateAsync();
    }
  };

  const getCartQuantity = (productId, variantId) => {
    return (
      cart.find(
        (i) =>
          Number(i.id) === Number(productId) &&
          Number(i.selectedSize?.id) === Number(variantId)
      )?.quantity || 0
    );
  };

  const handleAddToCart = (product, variant) => {
    addToCart({
      ...product,
      selectedSize: { ...variant, id: Number(variant.id) },
      price: variant.sellPrice,
    });

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${product.name}`,
    });
  };

   useEffect(() => {
  if (selectedProduct?.variants?.length > 0) {
    setSelectedSize(selectedProduct.variants[0]);
  }
}, [selectedProduct]);


  const renderItem = ({ item }) => {
    const firstVariant = item.variants?.[0];
    const quantity = getCartQuantity(item.id, firstVariant?.id);
    const isWishlisted = wishlist?.some((w) => w.product_id == item.id);

    return (
      <View className="w-[160px] ml-4 bg-white rounded-xl p-2 shadow shadow-gray-300">
        <TouchableOpacity
          onPress={() => toggleWishlist(item)}
          className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full"
        >
          <AntDesign
            name={isWishlisted ? 'heart' : 'hearto'}
            size={20}
            color={isWishlisted ? '#10b981' : 'gray'}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: item.image }}
          className="w-full h-[90px] rounded-lg"
          resizeMode="contain"
        />

        <Text className="text-sm font-semibold mt-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
          {item.tagline}
        </Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-green-700 font-bold text-sm">
            ₹{firstVariant?.sellPrice}
          </Text>
          {firstVariant?.discount && (
            <Text className="text-red-600 text-xs font-semibold">
              {firstVariant?.discount}
            </Text>
          )}
        </View>
        

        <TouchableOpacity
          className="border flex-row justify-between border-gray-300 rounded-md px-2 py-2 mt-2 mb-2"
          disabled={quantity > 0}
          onPress={() => {

            
            setSelectedProduct(item);
            setModalVisible(true);
          }}
        >
          <Text
            className={`text-gray-700 text-[14px] ${
              quantity > 0 && 'text-gray-200'
            }`}
          >
          {firstVariant?.size} {firstVariant?.option?.toLowerCase()}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={quantity > 0 ? '#e5e7eb' : '#6B7280'}
          />
        </TouchableOpacity>

        {quantity === 0 ? (
          <TouchableOpacity
            className="bg-white py-2 rounded-full border-2 border-green-500"
            onPress={() => handleAddToCart(item, firstVariant)}
          >
            <Text className="text-green-500 text-center font-semibold text-[14px]">
              Add to Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center justify-between bg-green-600 rounded-full px-3 py-[8px] w-full self-center">
            <TouchableOpacity
              onPress={() => decrement(item.id, firstVariant.id)}
            >
              <Ionicons name="remove" size={22} color="#fff" />
            </TouchableOpacity>
            <Text className="text-[14px] font-semibold text-white">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => increment(item.id, firstVariant.id)}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="py-2 mt-4">
      <Text className="text-lg font-bold px-4 mb-4">{title}</Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center h-32">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}

      {selectedProduct && (
        <Modal transparent visible={modalVisible} animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
            className="flex-1 bg-black/50 justify-center items-center"
          >
            <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
              <Text className="text-lg font-bold mb-3 text-gray-800">
                Select Size
              </Text>
              {selectedProduct?.variants?.map((sizeObj) => {
                const isSelected = selectedSize?.id === sizeObj?.id;
                return (
                  <TouchableOpacity
                    key={sizeObj?.id}
                    className={`py-3 px-3 rounded-lg mb-2 ${
                      isSelected
                        ? 'bg-green-100 border border-green-400'
                        : 'bg-gray-50'
                    }`}
                    onPress={() => {
                      setSelectedSize(sizeObj);
                      
                      setModalVisible(false);
                    }}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-[14px] ${
                          isSelected
                            ? 'text-green-800 font-bold'
                            : 'text-gray-700'
                        }`}
                      >
                        {sizeObj?.size} {sizeObj?.option?.toLowerCase()}
                      </Text>
                      <Text
                        className={`text-[14px] ${
                          isSelected
                            ? 'text-green-800 font-bold'
                            : 'text-gray-600'
                        }`}
                      >
                        ₹{sizeObj?.sellPrice}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default BuyitAgain;
