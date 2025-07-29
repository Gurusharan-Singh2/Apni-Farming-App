import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import {useRouter} from 'expo-router'
import { BackendUrl2 } from '../../utils/Constants';
import useAuthStore from '../../Store/AuthStore';
import useWishlistStore from '../../Store/WishlistStore';
import useCartStore from '../../Store/CartStore';

const CategoyComponentCard = ({ item }) => {
  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;
  const router=useRouter()

  const {
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  } = useWishlistStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] );
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart, cart, increment, decrement } = useCartStore();
 const quantity = useMemo(() => {
   return cart.find(
     (i) =>
       Number(i.id) === Number(item?.id) &&
      Number( i.selectedSize?.id) === Number(selectedSize?.id)

   )?.quantity || 0;
 }, [cart, item?.id, selectedSize?.size]);
  

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
       selectedSize: {
    ...selectedSize,
    id: Number(selectedSize.id),
  },
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
  <View className="w-[120px] ml-4 bg-white rounded-xl  shadow shadow-gray-300">
    <TouchableOpacity
      onPress={() => router.push(`product_details/${item?.id}`)}
      className="relative"
    >
      {isAuthenticated() && (
        <TouchableOpacity
          disabled={wishlistLoading}
          onPress={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full"
        >
          {addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
            <AntDesign name="loading1" size={18} color="#10b981" />
          ) : (
            <AntDesign
              name={isWishlisted ? 'heart' : 'hearto'}
              size={20}
              color={isWishlisted ? '#10b981' : 'gray'}
            />
          )}
        </TouchableOpacity>
      )}

      <Image
        source={{ uri: item?.image }}
        className="w-full h-[90px] rounded-lg"
        resizeMode="contain"
      />
    </TouchableOpacity>

    <Text className="text-sm font-semibold mt-1" numberOfLines={1}>
      {item.name}
    </Text>
    {item.tagline && (
      <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
        {item.tagline}
      </Text>
    )}

    <View className="flex-row justify-between items-center mb-1">
      <Text className="text-green-700 font-bold text-sm">
        ₹{selectedSize?.sellPrice}
      </Text>
      {selectedSize?.discount && (
        <Text className="text-red-600 text-xs font-semibold">
          {selectedSize?.discount}
        </Text>
      )}
    </View>

    {/* Size Picker */}
    <TouchableOpacity
      className="border flex-row justify-between border-gray-300 rounded-md px-2 py-2 mb-2"
      disabled={quantity > 0}
      onPress={() => setModalVisible(true)}
    >
      <Text
        className={`text-gray-700 text-[14px] ${
          quantity > 0 && 'text-gray-200'
        }`}
      >
        {selectedSize?.size} {selectedSize?.option?.toLowerCase()}
      </Text>
      <Ionicons
        name="chevron-down"
        size={16}
        color={quantity > 0 ? '#e5e7eb' : '#6B7280'}
      />
    </TouchableOpacity>

    {/* Cart Actions */}
    {quantity === 0 ? (
      <TouchableOpacity
        className="bg-white py-2 rounded-full border-2 border-green-500"
        onPress={handleAddToCart}
      >
        <Text className="text-green-500 text-center font-semibold text-[14px]">
          Add to Cart
        </Text>
      </TouchableOpacity>
    ) : (
      <View className="flex-row items-center justify-between bg-green-600 rounded-full px-3 py-[8px] w-full self-center">
        <TouchableOpacity onPress={() => decrement(item.id, selectedSize.id)}>
          <Ionicons name="remove" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-[14px] font-semibold text-white">
          {quantity}
        </Text>
        <TouchableOpacity onPress={() => increment(item.id, selectedSize.id)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    )}

    {/* Modal for Size Selection */}
    <Modal transparent visible={modalVisible} animationType="fade">
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center"
        activeOpacity={1}
        onPressOut={() => setModalVisible(false)}
      >
        <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
          <Text className="text-lg font-bold mb-3 text-gray-800">
            Select Size
          </Text>
          {item?.sizes?.map((sizeObj) => {
            const isSelected = selectedSize?.id === sizeObj?.id;
            return (
              <TouchableOpacity
                key={sizeObj?.id}
                className={`py-3 px-3 rounded-lg mb-2 ${
                  isSelected
                    ? 'bg-green-100 border border-green-400'
                    : 'bg-gray-50'
                }`}
                onPress={() => handleSelectSize(sizeObj)}
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
  </View>
);

};

export default CategoyComponentCard;
