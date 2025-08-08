import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useAuthStore from '../Store/AuthStore';
import useCartStore from '../Store/CartStore';
import useWishlistStore from '../Store/WishlistStore';
import { BackendUrl2 } from '../utils/Constants';

const ProductCard = ({ item }) => {
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
       i.selectedSize?.id === selectedSize?.id

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
  Toast.show({ type: 'success' ,text1: 'Success', text2: 'Added to wishlist',
    visibilityTime: 800,
    autoHide: true,
   });
},


    onError: (error) => {
      Toast.show({ type: 'error' ,text1: 'Add failed', text2: error.message,
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
  Toast.show({ type: 'success', text1: 'Success',text2:'Removed from wishlist' ,visibilityTime: 800, autoHide: true});
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
    <TouchableOpacity onPress={()=>router.push(`product_details/${item?.id}`)} className="bg-white ml-2 my-2 p-2 rounded-2xl w-[47%] shadow-md">
      {/* Image */}
      <View className="relative mb-4">
        <Image
          source={{ uri: item?.image }}
          className="w-full h-[150px] mt-4 rounded-xl"
          resizeMode="contain"
        />

{isAuthenticated() ?  addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
          <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <AntDesign name="loading1" size={20} color="#10b981" />
          </View>)
          :(
        
         <View className="z-40 w-8  absolute top-0 right-0">
            <TouchableOpacity
            disabled={wishlistLoading}
            className=" bg-white rounded-full"
            onPress={handleWishlistToggle}
          >
            <AntDesign
              name={isWishlisted ? 'heart' : 'hearto'}
              size={20}
              color={isWishlisted ? '#10b981' : 'gray'}
            />
          </TouchableOpacity>
         </View>
        ):""}

      
      </View>

      {/* Title */}
      <Text className="font-[700] text-sm text-gray-800 mb-1" numberOfLines={2}>
        {item?.name}
      </Text>
      <Text className="text-heading-small mb-1 text-green-600 font-bold ">
        {selectedSize?.discount}
      </Text>

      {/* Price */}
      
    <View className="flex-row self-start rounded-lg px-1 py-1  bg-[#D02127]    justify-between items-center mb-2">
  {selectedSize?.discount && <Text className="text-[13px] font-semibold py-1 px-1 rounded-l-lg bg-[#D02127] text-white line-through">
    ₹{selectedSize?.costPrice}
  </Text>}
  <Text className="text-[14px] bg-white mx-1 px-2 py-1 rounded  text-green-600 font-bold ">
    ₹{selectedSize?.sellPrice}
  </Text>
</View>



     

      {/* Size Picker */}
      <TouchableOpacity
        className="border z-10 border-gray-300 rounded-md px-2 py-2 mb-4 mt-2 flex-row justify-between items-center text-gray-100 disabled:border-gray-100"
        disabled={quantity>0}
        onPress={() => setModalVisible(true)}
      >
        <Text className={`text-gray-700 text-[14px] ${quantity>0 && 'text-gray-200'} `}>{selectedSize?.size+" "+selectedSize.option.toLowerCase()}</Text>
     <Text>
        <Text><Ionicons name="chevron-down" size={16} color={quantity > 0 ? '#e5e7eb' : '#6B7280'} /></Text>

     </Text>
      </TouchableOpacity>

      {/* Cart Control */}
      {quantity === 0 ? (
        <TouchableOpacity
          className="bg-white py-3 rounded-full border-2 font-semibold border-green-500"
          onPress={handleAddToCart}
        >
          <Text className="text-green-500 text-center font-semibold text-[14px]">Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row items-center justify-between bg-green-600 rounded-full px-3 py-[8px] w-[160px] self-center">
          <TouchableOpacity onPress={() => decrement(item.id, selectedSize.id)}>
            <Ionicons name="remove" size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-[14px] font-semibold text-white">{quantity}</Text>
          <TouchableOpacity onPress={() =>{
                              if(selectedSize?.maxOrder===null){
increment(item.id, selectedSize.id)
                              }else{
                                if(quantity<selectedSize?.maxOrder){
          increment(item.id, selectedSize.id)
                              }else{
                                Toast.show({
                                  type:"error",
                                  text1:"Max Quantity Reached"
                                })
                              }
                              }
                               }}>
            <Ionicons name="add" size={26} color="#fff" />
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
                  {item?.sizes?.map((sizeObj) => {
                    const isSelected =
                      selectedSize?.id === sizeObj?.id;
      
                    return (
                      <TouchableOpacity
                        key={sizeObj?.id}
                        className={`py-3 px-3 rounded-lg mb-2 ${
                          isSelected ? 'bg-green-100 border border-green-400' : 'bg-gray-50'
                        }`}
                        onPress={() => handleSelectSize(sizeObj)}
                      >
                        <View className="flex-row justify-between items-center">
                          <Text
                            className={`text-[14px] ${
                              isSelected ? 'text-green-800  font-bold' : 'text-gray-700'
                            }`}
                          >
                            {sizeObj?.size+" "+sizeObj?.option?.toLowerCase()}
                          </Text>
                          <Text
                            className={`text-[14px] ${
                              isSelected ? 'text-green-800 font-bold' : 'text-gray-600'
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
    </TouchableOpacity>
  );
};

// Wrap with React.memo for performance
export default React.memo(ProductCard);
