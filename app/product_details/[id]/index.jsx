import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../assets/Colors';
import Toast from 'react-native-toast-message';
import useCartStore from '../../../Store/CartStore';
import useAuthStore from '../../../Store/AuthStore';
import useWishlistStore from '../../../Store/WishlistStore';
import ProfileIcon from '../../../components/ProfileIcon';
import CartIconWithBadge from '../../../components/Carticon';
import BuyitAgain from '../../../components/BuyitAgain';
import Back from '../../../components/Back';

const BackendUrl2 = 'https://api.apnifarming.com';

const fetchProductById = async (productId) => {
  const res = await axios.post(`${BackendUrl2}/user/products/getProductbyid.php`, {
    productId: Number(productId),
  });
  return res.data.data;
};

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
 

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

 
  

  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;

  const { wishlist, addToWishlist, removeFromWishlist, setWishlist, clearWishlist } = useWishlistStore();
  const { cart, addToCart, increment, decrement } = useCartStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (data?.sizes && data?.sizes.length > 0) {
      setSelectedSize(data.sizes[0]);
    }
  }, [data]);

const quantity = useMemo(() => {
  return cart.find(
    (i) =>
      Number(i.id) === Number(data?.id) &&
      Number(i.selectedSize?.id) === Number(selectedSize?.id)
  )?.quantity || 0;
}, [cart, data?.id, selectedSize?.id]);


const isWishlisted = useMemo(() => {
  return wishlist?.some(w => w.product_id == data?.id); 
}, [wishlist, data?.id]);


  const {
    data: wishlistData,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ['wishlist', customer_id],
    queryFn: async () => {
      if (!customer_id) return [];
      const res = await axios.get(
        `${BackendUrl2}/user/wishlists/wishlist.php?action=list&customer_id=${customer_id}`
      );
      setWishlist(res.data.data);
      return res.data.data;
    },
    onSuccess: (data) => setWishlist(data),
    onError: (error) => {
      console.error('Error fetching wishlist:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load wishlist',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
      clearWishlist();
    },
    enabled: !!customer_id,
    staleTime: 1000 * 60 * 5,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=add`, {
        customer_id,
        product_id: data.id,
      });
      return res.data;
    },
    onSuccess: async () => {
      addToWishlist(data);
      refetchWishlist();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Added to wishlist',
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Add failed',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async () => {
      return await axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=remove`, {
        customer_id,
        product_id: data.id,
      });
    },
    onSuccess: async () => {
      removeFromWishlist(data.id);
      refetchWishlist();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Removed from wishlist',
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Remove failed',
        text2: error.message,
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
        await removeFromWishlistMutation.mutateAsync();
      } else {
        await addToWishlistMutation.mutateAsync();
      }
    } catch (err) {
      console.log('Wishlist toggle error:', err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({ type: 'error', text1: 'Please select a size first.' });
      return;
    }

    addToCart({
      ...data,
       selectedSize: {
    ...selectedSize,
    id: Number(selectedSize.id),
  },
      price: selectedSize.sellPrice,
    });

    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${data.name} was added successfully.`,
      visibilityTime: 800,
      autoHide:true
    });
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Failed to load product</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY  }}>
      {/* Header */}
      <View className="">
        <View className="flex flex-row w-full justify-between px-6 my-1">
           <Back title="Back" />
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>

      {/* Product Content */}
      <ScrollView className="px-6 pb-10 ">
        {isAuthenticated() && (
          <View className="z-40 w-8 absolute top-0 right-0">
            <TouchableOpacity
              className="bg-white rounded-full"
              onPress={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <AntDesign name="loading1" size={20} color="#10b981" />
              ) : (
                <AntDesign
                  name={isWishlisted ? 'heart' : 'hearto'}
                  size={20}
                  color={isWishlisted ? '#10b981' : 'gray'}
                />
              )}
            </TouchableOpacity>
          </View>
        )}

        <Image
          source={{ uri: data.image }}
          className="w-full h-[250px] my-4 rounded-xl"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-gray-800">{data.name}</Text>
        <Text className="text-gray-600 text-base mt-1">{data.tagline}</Text>
        <Text className="text-heading-small mb-1 text-green-600 font-bold">
          {selectedSize?.discount}
        </Text>

        {/* Price Section */}
        {selectedSize && (
          <View className="flex-row self-start mt-4 rounded-lg px-1 py-1 bg-[#D02127] justify-between items-center mb-2">
            {selectedSize.discount && (
              <Text className="text-[13px] font-semibold py-1 px-2 rounded-l-lg bg-[#D02127] text-white line-through">
                ₹{selectedSize.costPrice}
              </Text>
            )}
            <Text className="text-[14px] bg-white mx-1 px-2 py-1 rounded text-green-600 font-bold">
              ₹{selectedSize.sellPrice}
            </Text>
          </View>
        )}

        {/* Size Picker */}
        {selectedSize && (
          <TouchableOpacity
            className={`border border-gray-300 rounded-md px-2 py-3 my-3 flex-row justify-between items-center disabled:border-gray-100`}
            disabled={quantity>0}
            onPress={() => setModalVisible(true)}
          >
            <Text className={` text-[14px] ${quantity>0 ? "text-[#e5e7eb]":"text-gray-700"} `}>
              {selectedSize.size + ' ' + selectedSize.option?.toLowerCase()}
            </Text>
            <Ionicons name="chevron-down" size={16} color={quantity > 0 ? '#e5e7eb' : '#6B7280'} />
          </TouchableOpacity>
        )}

        {/* Add to Cart */}
        {quantity === 0 ? (
          <TouchableOpacity
            className="bg-white py-3 rounded-full border-2 border-green-500"
            onPress={handleAddToCart}
          >
            <Text className="text-green-500 text-center font-semibold text-[14px]">
              Add to Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center justify-between bg-green-600 rounded-full px-4 py-3 w-full self-center">
            <TouchableOpacity onPress={() => decrement(data?.id, selectedSize.id)} className="w-[33%]">
              <Text><Ionicons name="remove" size={26} color="#fff" /></Text>
            </TouchableOpacity>
            <Text className="text-[14px] text-center w-[33%] font-semibold text-white">{quantity}</Text>
            <TouchableOpacity className="w-[33%] flex-row justify-end" onPress={() => increment(data?.id, selectedSize.id)}>
              <Ionicons name="add" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {data?.description && (
          <>
           <Text className="text-black text-[16px] mt-4 font-bold">
          Description :
        </Text>
        <Text className="text-gray-600 text-[14px] mt-2">
          {data?.description}
        </Text>
          </>

        )}
       
         <BuyitAgain url={'https://api.apnifarming.com/user/products/buyitagain.php'} title={'Buy it Again'} method={"post"} objKey={"products"}  />
      </ScrollView>

      {/* Size Selection Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
            <Text className="text-lg font-bold mb-3 text-gray-800">Select Size</Text>
            {data?.sizes?.map((sizeObj) => {
              const isSelected = selectedSize?.id === sizeObj.id;
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
                      className={`text-[14px] ${
                        isSelected ? 'text-green-800 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {sizeObj.size + ' ' + sizeObj.option?.toLowerCase()}
                    </Text>
                    <Text
                      className={`text-[14px] ${
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

     
    </SafeAreaView>
  );
};

export default ProductDetails;
