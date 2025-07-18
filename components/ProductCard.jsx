import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import useCartStore from '../Store/CartStore';
import useAuthStore from '../Store/AuthStore';
import useWishlistStore from '../Store/WishlistStore';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { BackendUrl } from '../utils/Constants';
import { useMutation, useQuery } from '@tanstack/react-query';

const ProductCard = ({ item }) => {
  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;

  const {
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || {});
  const { addToCart, cart, increment, decrement } = useCartStore();
  const quantity = cart.find(i => i.id === item.id)?.quantity || 0;

  const isWishlisted = wishlist.includes(item.id);

  // Fetch wishlist on mount
  useQuery({
    queryKey: ['wishlist', customer_id],
    queryFn: async () => {
      const res = await axios.get(`${BackendUrl}/api/wishlists/${customer_id}`);
      const ids = res.data.map(w => w.product_id);
      setWishlist(ids); // update Zustand
      return ids;
    },
    enabled: !!customer_id,
  });

  // Add to backend wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`${BackendUrl}/api/wishlists`, {
        customer_id,
        product_id: item.id,
      }),
   
    onError: (error) => {
      Toast.show({ type: 'error', text1: 'Add failed', text2: error.message });
    },
  });

  // Remove from backend wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async () =>
      await axios.delete(`${BackendUrl}/api/wishlists`, {
        data: { customer_id, product_id: item.id },
      }),
   
    onError: (error) => {
      Toast.show({ type: 'error', text1: 'Remove failed', text2: error.message });
    },
  });

  const handleWishlistToggle = () => {
    if (!customer_id) {
      Toast.show({
        type: 'error',
        text1: 'Please login to manage wishlist.',
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(item.id); // local
      removeFromWishlistMutation.mutate(); // backend
    } else {
      addToWishlist(item.id); // local
      addToWishlistMutation.mutate(); // backend
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      selectedSize,
      price: selectedSize.sellPrice,
    });
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${item.name} was added successfully.`,
    });
  };

  const handleSelectSize = sizeObj => {
    setSelectedSize(sizeObj);
    setModalVisible(false);
  };

  return (
    <View className="bg-white ml-2 my-2 p-2 rounded-2xl w-[47%] shadow-md">
      {/* Image */}
      <View className="relative mb-4">
        <Image
          source={{ uri: item.image }}
          className="w-full h-[150px] mt-4 rounded-xl"
          resizeMode="contain"
        />
        {isAuthenticated() &&
          <TouchableOpacity
            className="absolute top-0 right-0   bg-white rounded-full"
            onPress={handleWishlistToggle}
          >
            <AntDesign
              name={isWishlisted ? 'heart' : 'hearto'}
              size={20}
              color={isWishlisted ? '#10b981' : 'gray'}
            />
          </TouchableOpacity>
        }
      </View>

      {/* Title */}
      <Text className="font-semibold text-sm text-gray-800 mb-1" numberOfLines={2}>
        {item.name}
      </Text>

      {/* Price */}
      <View className="flex-row items-center gap-4 space-x-2 mb-2">
        <Text className="text-xs text-red-500 line-through">₹{selectedSize.costPrice}</Text>
        <Text className="text-sm text-green-600 font-semibold">₹{selectedSize.sellPrice}</Text>
      </View>

      {/* Size Picker */}
      <TouchableOpacity
        className="border border-gray-300 rounded-md px-2 py-1 mb-3 flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-700 text-sm">{selectedSize.size}</Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      {/* Cart Control */}
      {quantity === 0 ? (
        <TouchableOpacity
          className="bg-white py-2 rounded-full border-2 font-semibold border-green-500"
          onPress={handleAddToCart}
        >
          <Text className="text-green-500 text-center font-semibold text-sm">Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row items-center justify-between bg-green-600 rounded-full px-3 py-2 w-[150px] self-center">
          <TouchableOpacity onPress={() => decrement(item.id)}>
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-base font-semibold text-white">{quantity}</Text>
          <TouchableOpacity onPress={() => increment(item.id)}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Size Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[80%]">
            <Text className="text-base font-semibold mb-3">Available Sizes</Text>
            {item.sizes.map((sizeObj, index) => (
              <TouchableOpacity
                key={index}
                className={`py-3 border-b border-gray-200 ${selectedSize.size === sizeObj.size ? 'bg-green-200' : ''}`}
                onPress={() => handleSelectSize(sizeObj)}
              >
                <View className="flex-row px-2 justify-between items-center">
                  <Text className={`text-gray-700 text-sm ${selectedSize.size === sizeObj.size ? 'font-bold text-green-600' : ''}`}>
                    {sizeObj.size}
                  </Text>
                  <Text className={`text-sm ${selectedSize.size === sizeObj.size ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                    ₹{sizeObj.sellPrice}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProductCard;
