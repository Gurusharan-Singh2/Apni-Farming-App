import React, { useEffect, useMemo, useState } from 'react';
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
import { BackendUrl2 } from '../utils/Constants';
import { useMutation, useQuery } from '@tanstack/react-query';

const ProductCard = ({ item }) => {
  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;

  const {
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  } = useWishlistStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || {});
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart, cart, increment, decrement } = useCartStore();
  const quantity = cart.find(i => i.id === item.id)?.quantity || 0;

  

const isWishlisted = useMemo(() => {
  return wishlist?.some(w => w.product_id == item.id); 
}, [wishlist, item.id]);



const {
  data: wishlistData,
  refetch: refetchWishlist
} = useQuery({
  queryKey: ['wishlist', customer_id],
  queryFn: async () => {
    if (!customer_id) return [];
    const res = await axios.get(`https://api.apnifarming.com/user/wishlists/wishlist.php?action=list&customer_id=${customer_id}`);
  
    
    setWishlist(res.data.data)
    return res.data.data;
  },
  onSuccess: (data) => {
    setWishlist(data);
  },
  onError: (error) => {
    console.error('Error fetching wishlist:', error.message);
    Toast.show({ type: 'error', text1: 'Failed to load wishlist', text2: error.message,
      visibilityTime: 1000,
      autoHide: true,
     });
    clearWishlist();
  },
  enabled: !!customer_id,
  staleTime: 1000 * 60 * 5, 
});





  const addToWishlistMutation = useMutation({
    mutationFn: async () =>{
    const res =  await axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=add`, {
        customer_id,
        product_id: item.id,
      })
    return res.data },
   onSuccess: async (data) => {
  addToWishlist(item); 
  refetchWishlist(); 
  Toast.show({ type: 'success', text1: 'Added to wishlist',
    visibilityTime: 1000,
    autoHide: true,
   });
},


    onError: (error) => {
      Toast.show({ type: 'error', text1: 'Add failed', text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
       });
    },
  });

  // Remove from backend wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=remove`, {
        customer_id,
        product_id: item.id,
      }),
   onSuccess: async () => {
  removeFromWishlist(item.id); // local update
  refetchWishlist(); // optional sync
  Toast.show({ type: 'success', text1: 'Removed from wishlist' ,visibilityTime: 1000, autoHide: true});
}
,
   
    onError: (error) => {
      Toast.show({ type: 'error', text1: 'Remove failed', text2: error.message ,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
  });

  const handleWishlistToggle = async () => {
    if (!customer_id) {
      Toast.show({
        type: 'error',
        text1: 'Please login to manage wishlist.',
      });
      return;
    }

    setWishlistLoading(true);
    try {
     if (isWishlisted) {
  await removeFromWishlistMutation.mutateAsync(); // backend
} else {
  await addToWishlistMutation.mutateAsync(); // backend
}

    } catch (err) {
      
    } finally {
      setWishlistLoading(false);
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
      visibilityTime: 1000,
      autoHide: true,
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

{isAuthenticated() ?  addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
          <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <AntDesign name="loading1" size={20} color="#10b981" />
          </View>)
          :(
        
           <TouchableOpacity
            disabled={wishlistLoading}
            className="absolute top-0 right-0 bg-white rounded-full"
            onPress={handleWishlistToggle}
          >
            <AntDesign
              name={isWishlisted ? 'heart' : 'hearto'}
              size={20}
              color={isWishlisted ? '#10b981' : 'gray'}
            />
          </TouchableOpacity>
        ):""}

      
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
        <Text className="text-gray-700 text-sm">{selectedSize.size+" "+selectedSize.option.toLowerCase()}</Text>
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
                className="flex-1 bg-black/50 justify-center items-center"
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
              >
                <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
                  <Text className="text-lg font-bold mb-3 text-gray-800">Select Size</Text>
                  {item.sizes?.map((sizeObj) => {
                    const isSelected =
                      selectedSize.size === sizeObj.size;
      
                    return (
                      <TouchableOpacity
                        key={sizeObj.id}
                        className={`py-3 px-3 rounded-lg mb-2 ${
                          isSelected ? 'bg-green-100 border border-green-400' : 'bg-gray-50'
                        }`}
                        onPress={() => handleSelectSize(sizeObj)}
                      >
                        <View className="flex-row justify-between items-center">
                          <Text
                            className={`text-sm ${
                              isSelected ? 'text-green-800 font-bold' : 'text-gray-700'
                            }`}
                          >
                            {sizeObj.size+" "+sizeObj.option?.toLowerCase()}
                          </Text>
                          <Text
                            className={`text-sm ${
                              isSelected ? 'text-green-800 font-bold' : 'text-gray-600'
                            }`}
                          >
                            ₹{sizeObj.sellPrice}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
            </Modal>
    </View>
  );
};

export default ProductCard;
